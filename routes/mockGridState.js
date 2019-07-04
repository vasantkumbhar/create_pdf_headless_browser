module.exports = {
  "take": 20,
  "skip": 0,
  "filter": {
    "filters": [
      {
        "logic": "or",
        "filters": [
          {
            "field": "edoToolStatus",
            "operator": "eq",
            "value": "Accepted"
          }
        ]
      }
    ],
    "logic": "and"
  },
  "sort": [
    {
      "dir": "asc",
      "field": "tlmShipDate"
    },
    {
      "dir": "asc",
      "field": "toolName"
    }
  ],
  "group": [
    {
      "dir": "asc",
      "field": "nextShipDate",
      "aggregates": [
        {
          "field": "Counter",
          "aggregate": "sum"
        }
      ]
    },
    {
      "dir": "asc",
      "field": "tcoNumber",
      "aggregates": [
        {
          "field": "Counter",
          "aggregate": "sum"
        }
      ]
    },
    {
      "dir": "asc",
      "field": "productLine",
      "aggregates": [
        {
          "field": "Counter",
          "aggregate": "sum"
        }
      ]
    },
    {
      "dir": "asc",
      "field": "productGroup",
      "aggregates": [
        {
          "field": "Counter",
          "aggregate": "sum"
        }
      ]
    }
  ]
}