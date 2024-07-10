export default {
  entityName: "groups",
  entities: [
    {
      data: {
        id: "1",
        name: "Entities limited by number of subscriptions"
      },
      identity: {
        id: "1"
      }
    },
    {
      data: {
        id: "2",
        name: "Deferred subscription when re-subscribing during the paid period"
      },
      identity: {
        id: "2"
      }
    },
    {
      data: {
        id: "3",
        name: "Group for mass unsubscribing from entities"
      },
      identity: {
        id: "3"
      }
    }
  ],
  limit: "10",
  offset: "0",
  totalCount: "3",
  hasFurtherData: false
};
