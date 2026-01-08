// orderHelper.js

const getDateRange = () => {
  const currentDate = new Date();
  const previous30DaysStart = new Date(
    currentDate.setDate(currentDate.getDate() - 60)
  ); // Start date 60 days ago
  const current30DaysStart = new Date(
    currentDate.setDate(currentDate.getDate() - 30)
  ); // Start date 30 days ago
  return { current30DaysStart, previous30DaysStart };
};

const aggregateOrders = async (Order) => {
  const { current30DaysStart, previous30DaysStart } = getDateRange();

  const orders = await Order.aggregate([
    {
      $facet: {
        current30Days: [
          {
            $match: {
              createdAt: {
                $gte: current30DaysStart, // Orders in the last 30 days
                $lte: new Date(),
              },
            },
          },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
            },
          },
        ],
        previous30Days: [
          {
            $match: {
              createdAt: {
                $gte: previous30DaysStart, // Orders from 30 to 60 days ago
                $lt: current30DaysStart,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const currentTotalOrders = orders[0].current30Days[0]?.totalOrders || 0;
  const previousTotalOrders = orders[0].previous30Days[0]?.totalOrders || 0;

  let change = 0;
  if (previousTotalOrders > 0) {
    change =
      ((currentTotalOrders - previousTotalOrders) / previousTotalOrders) * 100;
  } else if (previousTotalOrders === 0 && currentTotalOrders > 0) {
    change = 100; // No orders in previous period, 100% increase
  }

  return {
    currentTotalOrders,
    previousTotalOrders,
    change,
  };
};

// Export the function for use in other files
export { aggregateOrders };
