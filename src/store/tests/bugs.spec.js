import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  addBug,
  removeBug,
  resolveBug,
  getUnresolvedBugs,
  loadBugs,
  getBugsByUser,
  assignBugToUser,
} from "../bugs";
import configureStore from "../configStore";

describe("bugsSlice", () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = () => store.getState().entities.bugs;

  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  it("should add the bug to the store if it's saved to the server", async () => {
    // Arrange
    const bug = { description: "a" };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost("/bugs").reply(200, savedBug);

    // Act
    await store.dispatch(addBug(bug));

    // Assert
    expect(bugsSlice().list).toContainEqual(savedBug);
  });

  it("should not add the bug to the store if it's not saved to the server", async () => {
    // Arrange
    const bug = { description: "a" };
    fakeAxios.onPost("/bugs").reply(500);

    // Act
    await store.dispatch(addBug(bug));

    // Assert
    expect(bugsSlice().list).toHaveLength(0);
  });

  it("should delete the bug from the store if it's saved to the server", async () => {
    // Arrange
    fakeAxios.onDelete("/bugs/1").reply(200);
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    // Act
    await store.dispatch(addBug({}));
    await store.dispatch(removeBug(1));
    console.log("state is", bugsSlice().list);

    // Assert
    expect(bugsSlice().list.id).toBe(undefined);
  });

  it("should not delete the bug from the store if it's not saved to the server", async () => {
    // Arrange
    fakeAxios.onDelete("/bugs/1").reply(500);
    fakeAxios.onPost("/bugs").reply(200, { id: 2 });

    // Act
    await store.dispatch(addBug({}));
    await store.dispatch(removeBug(1));
    console.log("dont delete", bugsSlice().list);

    // Assert
    expect(bugsSlice().list).toHaveLength(1);
  });

  it("should assign bug to user if it's saved to the server", async () => {
    // Arrange
    const assignedBug = { id: 1, userId: 3 };
    fakeAxios.onPatch("/bugs/1").reply(200, assignedBug);
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    // Act
    await store.dispatch(addBug({}));
    await store.dispatch(assignBugToUser(1, 3));

    // Assert
    expect(bugsSlice().list[0].userId).toBe(3);
  });

  it("should not assign bug to user if it's not saved to the server", async () => {
    // Arrange
    fakeAxios.onPatch("/bugs/1").reply(500);
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    // Act
    await store.dispatch(addBug({}));
    await store.dispatch(assignBugToUser(1, 3));

    // Assert
    expect(bugsSlice().list[0].userId).not.toBe(3);
  });

  it("should mark the bug as resolved if it's saved to the server", async () => {
    // Arrange
    const resolvedBug = { id: 1, resolved: true };
    fakeAxios.onPatch("/bugs/1").reply(200, resolvedBug);
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    // Act
    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(1));

    // Assert
    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  it("should not mark the bug as resolved if it's not saved to the server", async () => {
    // Arrange
    fakeAxios.onPatch("/bugs/1").reply(500);
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    // Act
    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(1));

    // Assert
    expect(bugsSlice().list[0].resolved).not.toBe(true);
  });

  describe("loading bugs", () => {
    describe("if the bugs exist in the cache", () => {
      it("they should not be fetched from the server again", async () => {
        // Arrange
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        // Act
        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        // Assert
        expect(fakeAxios.history.get.length).toBe(1);
      });
    }),
      describe("if the bugs don't exist in the cache", () => {
        it("they should be fetched from the server and put in the store.", async () => {
          // Arrange
          fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

          // Act
          await store.dispatch(loadBugs());

          // Assert
          expect(bugsSlice().list).toHaveLength(1);
        });

        describe("loading indicator", () => {
          it("should be true while fetching the bugs", () => {
            // Arrange and Assert
            fakeAxios.onGet("/bugs").reply(() => {
              expect(bugsSlice().loading).toBe(true);
              return [200, [{ id: 1 }]];
            });

            // Act
            store.dispatch(loadBugs());
          });

          it("should be false after the bugs are fetched", async () => {
            // Arrange and Assert
            fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

            // Act
            await store.dispatch(loadBugs());

            // Assert
            expect(bugsSlice().loading).toBe(false);
          });

          it("should be false if the server returns an error", async () => {
            // Arrange and Assert
            fakeAxios.onGet("/bugs").reply(500);

            // Act
            await store.dispatch(loadBugs());

            // Assert
            expect(bugsSlice().loading).toBe(false);
          });
        });
      });
  });

  describe("selectors", () => {
    it("should get unresolvedbugs", () => {
      // Arrange
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 2 },
        { id: 3 },
      ];

      // Act
      const result = getUnresolvedBugs(state);

      // Assert
      expect(result).toHaveLength(2);
    });

    it("should get bugs by user", () => {
      // Arrange
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, userId: 2 },
        { id: 2, userId: 3 },
        { id: 3, userId: 1 },
      ];

      // Act
      const result = getBugsByUser(1)(state);

      // Assert
      expect(result).toHaveLength(1);
    });
  });
});
