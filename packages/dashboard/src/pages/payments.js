import dayjs from "dayjs";
import Layout from "../components/Layout";
import useSWR from "swr";
import ky from "ky/umd";
import { useState } from "react";

const plans = [
  { id: "initial_free", stripe: null, name: "Free", price: 0, description: "Unlimited bandwidth with throttled speed" },
  {
    id: "initial_plus",
    stripe: "price_1IO6FpIzjULiPWN6XHIG5mU9",
    name: "Skynet Plus",
    price: 5,
    description: "1 TB premium bandwidth with full speed",
  },
  {
    id: "initial_pro",
    stripe: "price_1IO6FpIzjULiPWN6xYjmUuGb",
    name: "Skynet Pro",
    price: 20,
    description: "5 TB premium bandwidth with full speed",
  },
  {
    id: "initial_extreme",
    stripe: "price_1IO6FpIzjULiPWN636iFN02j",
    name: "Skynet Extreme",
    price: 80,
    description: "20 TB premium bandwidth with full speed",
  },
];
const stripeCustomerId = "cus_J09ECKPgFEPXoq";
const activePlanId = "initial_free";

const fetcher = (url) => fetch(url).then((r) => r.json());

const ActiveBadge = () => {
  return (
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800 ml-3">
      active
    </span>
  );
};

export default function Payments() {
  const [selectedPlanId, setSelectedPlanId] = useState("initial_free");
  const selectedPlan = plans.find(({ id }) => selectedPlanId === id);
  const handleSubscribe = async () => {
    try {
      const price = selectedPlan.stripe;
      const { sessionId } = await ky.post("/api/stripe/createCheckoutSession", { json: { price } }).json();
      const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.log(error); // todo: handle error
    }
  };

  return (
    <Layout title="Payments">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          {/* This example requires Tailwind CSS v2.0+ */}
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Current plan</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">Free</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Current payment</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">&mdash;</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Plan usage this month</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">24.57%</dd>
              </div>
            </div>
          </dl>

          {/* Plan */}
          <section aria-labelledby="plan_heading">
            <form action="#" method="POST">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="ml-4 mt-2">
                      <h3 id="plan_heading" className="text-lg leading-6 font-medium text-gray-900">
                        Plan
                      </h3>
                    </div>
                  </div>
                  <fieldset>
                    <legend className="sr-only">Pricing plans</legend>
                    <ul className="relative bg-white rounded-md -space-y-px">
                      {plans.map((plan, index) => (
                        <li key={plan.id}>
                          {/* On: "bg-orange-50 border-orange-200 z-10", Off: "border-gray-200" */}
                          <div
                            className={`relative border ${index === 0 ? "rounded-tl-md rounded-tr-md" : ""} ${
                              index === plans.length - 1 ? "rounded-bl-md rounded-br-md" : ""
                            } p-4 flex flex-col md:pl-4 md:pr-6 md:grid md:grid-cols-3`}
                          >
                            <label className="flex items-center text-sm cursor-pointer">
                              <input
                                name="pricing_plan"
                                type="radio"
                                className="h-4 w-4 text-orange-500 cursor-pointer focus:ring-gray-900 border-gray-300"
                                aria-describedby="plan-option-pricing-0 plan-option-limit-0"
                                checked={plan.id === selectedPlanId}
                                onChange={() => console.log(plan.id) || setSelectedPlanId(plan.id)}
                              />
                              <span className="ml-3 font-medium text-gray-900">{plan.name}</span>
                              {activePlanId === plan.id && <ActiveBadge />}
                            </label>
                            <p id="plan-option-pricing-0" className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
                              {/* On: "text-orange-900", Off: "text-gray-900" */}
                              <span className="font-medium">{plan.price ? `$${plan.price} / mo` : "no cost"}</span>
                              {/* On: "text-orange-700", Off: "text-gray-500" */}
                              {/* <span>($290 / yr)</span> */}
                            </p>
                            {/* On: "text-orange-700", Off: "text-gray-500" */}
                            <p id="plan-option-limit-0" className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right">
                              {plan.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={activePlanId === selectedPlanId}
                    className="bg-green-800 disabled:bg-gray-300 disabled:text-gray-400 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500 text-center my-3">
                To manage your active subscription, payment methods and view your billing history, go to{" "}
                <a href="/api/stripe/customerPortal" className="text-green-600 hover:text-green-900">
                  Stripe Customer Portal
                </a>
              </div>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
}
