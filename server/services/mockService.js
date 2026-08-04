const mockPayment = async (type, details) => {

    console.log("================================");
    console.log("MOCK PAYMENT ENGINE");
    console.log("TYPE:", type);
    console.log("DETAILS:", details);
    console.log("================================");


    // ==========================================
    // MOCK DATA PLANS
    // ==========================================

    if (type === "dataPlans") {

        return {

            success: true,

            data: {

                code: "000",

                response_description: "Successful",

                content: {

                    variations: [

                        {
                            variation_code: "500MB",
                            name: "500MB Data",
                            variation_amount: "500"
                        },

                        {
                            variation_code: "1GB",
                            name: "1GB Data",
                            variation_amount: "1000"
                        },

                        {
                            variation_code: "2GB",
                            name: "2GB Data",
                            variation_amount: "1500"
                        },

                        {
                            variation_code: "5GB",
                            name: "5GB Data",
                            variation_amount: "3000"
                        }

                    ]

                }

            }

        };

    }


    // ==========================================
    // MOCK CABLE PLANS
    // ==========================================

    if (type === "cablePlans") {

        return {

            success: true,

            data: {

                code: "000",

                response_description: "Successful",

                content: {

                    variations: [

                        {
                            variation_code: "BASIC",
                            name: "Basic Test Subscription",
                            variation_amount: "500"
                        },

                        {
                            variation_code: "STANDARD",
                            name: "Standard Test Subscription",
                            variation_amount: "1000"
                        },

                        {
                            variation_code: "PREMIUM",
                            name: "Premium Test Subscription",
                            variation_amount: "2000"
                        }

                    ]

                }

            }

        };

    }


    // ==========================================
    // MOCK NORMAL PAYMENT
    // Airtime / Data / Cable / Electricity
    // ==========================================

    return {

        success: true,

        data: {

            code: "000",

            response_description:
                "Transaction Successful",

            content: {

                transactions: {

                    status: "delivered"

                }

            }

        }

    };

};


module.exports = {
    mockPayment
};