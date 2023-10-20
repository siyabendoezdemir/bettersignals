$(document).ready(function () {
  const subscriptionList = $(".subscriptions");

  // Handle "Subscribe" and "Unsubscribe" form submissions
  $("form").on("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = $(this); // Get the form that was submitted
    const url = form.attr("action"); // Get the form's action (API endpoint)
    const button = form.find("button");

    // Make an AJAX POST request to the API
    $.ajax({
      type: "POST",
      url: url,
      success: function (response) {
        // Handle the API response
        if (button.text() === "Subscribe") {
          button.text("Unsubscribe");
          form.attr(
            "action",
            url.replace("/payment/checkout/*", "/unsubscribe/")
          );

          // Add the trader to the subscription list
          const traderName = form.siblings("span:first").text();
          addToSubscriptionList(traderName);
        } else {
          button.text("Subscribe");
          form.attr(
            "action",
            url.replace("/unsubscribe/", `/payment/checkout/${trader._id}`)
          );

          // Remove the trader from the subscription list
          const traderName = form.siblings("span:first").text();
          removeFromSubscriptionList(traderName);
        }
      },
      error: function (error) {
        // Handle API error
        console.log("Error:", error);
      },
    });
  });

  // Function to add a trader to the subscription list
  function addToSubscriptionList(traderName) {
    // Create a new list item and append it to the subscription list
    const listItem = `<li><span>${traderName}</span><span>$70</span></li>`;
    subscriptionList.append(listItem);
  }

  // Function to remove a trader from the subscription list
  function removeFromSubscriptionList(traderName) {
    // Find and remove the list item corresponding to the trader
    subscriptionList.find(`li:contains(${traderName})`).remove();
  }

  $("button.subscribe-button").click(function (event) {
    event.preventDefault(); // Prevent the default form submission

    const button = $(this); // Get the clicked button
    const traderId = button.data("trader-id"); // Get the trader ID from the data attribute
    console.log("At least it's working")
    // Make an AJAX request to the server to fetch the checkout URL
    $.ajax({
      url: "/payment/checkout/" + traderId, // Replace with the correct URL
      method: "POST",
      success: function (data) {
        const { checkoutURL } = data;

        // Redirect the user to the Stripe Checkout URL
        window.location.href = checkoutURL;
      },
      error: function (error) {
        console.error("Error:", error);
        // Handle the error, e.g., display a message to the user
      },
    });
  });
});
