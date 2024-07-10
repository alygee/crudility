export default {
  schema: {
    enums: [],
    entities: [
      {
        name: "groups",
        title: "Группы entities",
        order: {
          by: "id",
          inReverse: false
        },
        description: null,
        fields: [
          {
            name: "id",
            title: null,
            description: null,
            type: "long",
            generated: true,
            required: true,
            default: null
          },
          {
            name: "name",
            title: null,
            description: null,
            type: "string",
            generated: false,
            required: true,
            default: null
          }
        ],
        fk: [],
        revFk: [],
        medLnk: []
      }
    ]
  }
};
