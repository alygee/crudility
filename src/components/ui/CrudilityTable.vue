<template>
  <div class="crudility-table">
    <v-data-table
      :items="table.items"
      :headers="table.headers"
      :page="table.page"
      :server-items-length="table.serverItemsLength"
      :footer-props="{ itemsPerPageOptions: [5, 10, 20, 50, 100],
             pageText: isTotalCountUnknown ? '' : undefined,
             showCurrentPage: true }"
      disable-sort
      @update:options="onOptionsUpdate"
    >
      <template v-slot:item="item">
        <tr @mouseenter="onHover">
          <td
            v-for="header in item.headers"
            :key="header.value"
            :style="styleProp"
            :class="'td-' + header.value"
            @click="onClick(item.item)"
          >
            <div v-if="isActions(header)">
              <v-btn
                v-for="action in actions"
                icon
                :key="action.event"
                @click.stop="$emit('action', action.event, item.item.identity)"
              >
                <v-icon>{{ action.icon }}</v-icon>
              </v-btn>
            </div>
            <div v-else>
              <span v-html="getTableCellValue(item.item, header.value)"></span>
              <a
                v-if="showMore(item.item, header.value)"
                @click.stop="updateQuery(item.item, header.value)"
              >
                {{ $t('details') }}
              </a>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="total-count">
      <v-btn
        v-if="isTotalCountUnknown"
        small
        outlined
        color="grey"
        @click="service.getTotalCount()"
      >
        {{ $t('total_count') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CrudilityTable',
  props: {
    table: Object,
    service: Object
  },
  data () {
    return {
      height: 0,
      top: 0,
      actions: [
        {
          icon: 'mdi-delete',
          title: '',
          event: 'delete'
        }
      ]
    }
  },
  computed: {
    isTotalCountUnknown () {
      return this.table.hasFurtherData && this.table.serverItemsLength !== -1
    },
    styleProp () {
      return {
        '--height': this.height + 'px',
        '--top': this.top + 'px'
      }
    }
  },
  methods: {
    onOptionsUpdate ({ page, itemsPerPage }) {
      this.table.offset = (page - 1) * itemsPerPage
      this.table.itemsPerPage = itemsPerPage
      this.table.page = page
      this.service.handleOptionsChange()
    },

    onClick (item) {
      this.service.handleRowClick(item)
    },

    onHover (e) {
      this.top = e.target.parentElement.parentElement.offsetTop + e.currentTarget.offsetTop
      this.height = e.currentTarget.offsetHeight
    },

    isActions (header) {
      return header.value === 'actions'
    },

    getTableCellValue (item, header) {
      return item.data ? item.data[header] : item[header]
    },

    showMore (item, header) {
      return item.meta && item.meta[header]
    },

    updateQuery (item, header) {
      this.$emit('search', item.meta && item.meta[header])
      window.scrollTo(0, 0);
    }
  }
}
</script>

<style lang="scss">
  .total-count {
    display: flex;
    justify-content: flex-end;
  }

  .crudility-table {

    thead {
      tr th:first-child {
        border-radius: 5px 0 0 5px;
      }

      tr th:last-child {
        border-radius: 0 5px 5px 0;
      }

      th {
        background-color: #f1f2f2;
        border-bottom: 0 !important;
        height: 40px !important;
      }
    }

    tbody tr {
      cursor: pointer;

      .td-actions {
        padding-left: 70px !important;
        div {
          visibility: hidden;

          padding-left: 70px !important;
          padding-right: 15px;
          white-space: nowrap;

          margin-right: calc( var(--wrapper-margin) + 12px);
          display: flex;
          align-items: center;

          background-color: #ebf4ef !important;

          position: absolute;
          right: 0;
          top: var(--top) !important;
          height: var(--height) !important;

          button {
            font-size: x-large !important;
          }
        }
      }

      td {
        border-bottom: 1px solid #f1f2f2 !important;
      }

      &:hover {
        td {
          background-color: #ebf4ef !important;
        }

        .td-actions {
          div {
            visibility: visible;
          }
        }
      }
    }
  }
</style>


<i18n>
{
  "ru": {
    "total_count": "Подсчитать общее количество",
    "details": "Подробнее"
  },
  "en": {
    "total_count": "Compute total count",
    "details": "Show more"
  }
}
</i18n>