import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// prevent user from subscribing to the same channel twice
subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });
// prevent user from subscribing to their own channel
subscriptionSchema.pre("save", function (next) {
  if (this.subscriber.toString() === this.channel.toString()) {
    return next(new Error("You cannot subscribe to your own channel"));
  }
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
