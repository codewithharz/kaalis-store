const CluesBucks = require("../models/cluesBucksModel");

const getRewardsAccount = async (userId) =>
  (await CluesBucks.findOne({ user: userId })) || new CluesBucks({ user: userId });

const applyOrderRewards = async (order) => {
  if (!order) return false;

  const shouldApplyCluesBucks =
    !order.metadata?.cluesBucksApplied &&
    (order.cluesBucks?.pointsUsed || order.cluesBucks?.pointsEarned);
  const shouldApplyStoreCredit =
    !order.metadata?.storeCreditApplied && order.storeCredit?.amountUsed;

  if (!shouldApplyCluesBucks && !shouldApplyStoreCredit) {
    return false;
  }

  const rewardsAccount = await getRewardsAccount(order.user);

  if (shouldApplyCluesBucks) {
    rewardsAccount.balance +=
      (order.cluesBucks?.pointsEarned || 0) -
      (order.cluesBucks?.pointsUsed || 0);

    if (order.cluesBucks?.pointsUsed) {
      rewardsAccount.transactions.push({
        type: "spent",
        points: order.cluesBucks.pointsUsed,
        description: `Used for order #${order.orderId}`,
        source: "order_discount",
        orderId: order._id,
        metadata: {
          type: "points",
        },
      });
    }

    if (order.cluesBucks?.pointsEarned) {
      rewardsAccount.transactions.push({
        type: "earned",
        points: order.cluesBucks.pointsEarned,
        description: `Earned from order #${order.orderId}`,
        source: "purchase",
        orderId: order._id,
      });
    }
  }

  if (shouldApplyStoreCredit) {
    rewardsAccount.storeCreditBalance = Math.max(
      0,
      (rewardsAccount.storeCreditBalance || 0) - order.storeCredit.amountUsed
    );
    rewardsAccount.transactions.push({
      type: "spent",
      points: 0,
      description: `Used ₦${order.storeCredit.amountUsed} store credit on order #${order.orderId}`,
      source: "store_credit_order",
      orderId: order._id,
      metadata: {
        type: "credit",
        amount: order.storeCredit.amountUsed,
        action: "used",
        balanceAfter: rewardsAccount.storeCreditBalance,
      },
    });
  }

  await rewardsAccount.save();

  order.metadata = {
    ...(order.metadata || {}),
    cluesBucksApplied: true,
    storeCreditApplied: true,
    rewardsReversed: false,
    rewardsAppliedAt: new Date(),
  };

  return true;
};

const reverseOrderRewards = async (order, reason = "Order cancelled") => {
  if (
    !order ||
    order.metadata?.rewardsReversed ||
    (!order.metadata?.cluesBucksApplied && !order.metadata?.storeCreditApplied)
  ) {
    return false;
  }

  const rewardsAccount = await getRewardsAccount(order.user);

  if (order.metadata?.cluesBucksApplied) {
    const pointsUsed = Number(order.cluesBucks?.pointsUsed || 0);
    const pointsEarned = Number(order.cluesBucks?.pointsEarned || 0);

    if (pointsUsed) {
      rewardsAccount.balance += pointsUsed;
      rewardsAccount.transactions.push({
        type: "earned",
        points: pointsUsed,
        description: `Restored from ${reason.toLowerCase()} for order #${order.orderId}`,
        source: "order_reversal",
        orderId: order._id,
        metadata: {
          type: "points",
        },
      });
    }

    if (pointsEarned) {
      rewardsAccount.balance -= pointsEarned;
      rewardsAccount.transactions.push({
        type: "spent",
        points: pointsEarned,
        description: `Reversed earned CluesBucks after ${reason.toLowerCase()} for order #${order.orderId}`,
        source: "order_reward_reversal",
        orderId: order._id,
        metadata: {
          type: "points",
        },
      });
    }
  }

  if (order.metadata?.storeCreditApplied && order.storeCredit?.amountUsed) {
    rewardsAccount.storeCreditBalance =
      (rewardsAccount.storeCreditBalance || 0) + order.storeCredit.amountUsed;
    rewardsAccount.transactions.push({
      type: "earned",
      points: 0,
      description: `Restored ₦${order.storeCredit.amountUsed} store credit after ${reason.toLowerCase()} for order #${order.orderId}`,
      source: "store_credit_reversal",
      orderId: order._id,
      metadata: {
        type: "credit",
        amount: order.storeCredit.amountUsed,
        action: "restored",
        balanceAfter: rewardsAccount.storeCreditBalance,
      },
    });
  }

  await rewardsAccount.save();

  order.metadata = {
    ...(order.metadata || {}),
    rewardsReversed: true,
    rewardsReversedAt: new Date(),
    rewardReversalReason: reason,
  };

  return true;
};

module.exports = {
  applyOrderRewards,
  reverseOrderRewards,
};
