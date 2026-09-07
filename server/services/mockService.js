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

        const network = details?.network || "mtn";


        const dataPlans = {

            mtn: [

                {
                    variation_code: "MTN-100MB",
                    name: "100MB Daily Data",
                    variation_amount: "100",
                    validity: "1 Day"
                },

                {
                    variation_code: "MTN-200MB",
                    name: "200MB Daily Data",
                    variation_amount: "180",
                    validity: "1 Day"
                },

                {
                    variation_code: "MTN-500MB",
                    name: "500MB Daily Data",
                    variation_amount: "300",
                    validity: "1 Day"
                },

                {
                    variation_code: "MTN-1GB-D",
                    name: "1GB Daily Data",
                    variation_amount: "500",
                    validity: "1 Day"
                },

                {
                    variation_code: "MTN-1GB-W",
                    name: "1GB Weekly Data",
                    variation_amount: "800",
                    validity: "7 Days"
                },

                {
                    variation_code: "MTN-2GB-W",
                    name: "2GB Weekly Data",
                    variation_amount: "1200",
                    validity: "7 Days"
                },

                {
                    variation_code: "MTN-3GB-W",
                    name: "3GB Weekly Data",
                    variation_amount: "1500",
                    validity: "7 Days"
                },

                {
                    variation_code: "MTN-5GB-W",
                    name: "5GB Weekly Data",
                    variation_amount: "2500",
                    validity: "7 Days"
                },

                {
                    variation_code: "MTN-1GB-M",
                    name: "1GB Monthly Data",
                    variation_amount: "1000",
                    validity: "30 Days"
                },

                {
                    variation_code: "MTN-2GB-M",
                    name: "2GB Monthly Data",
                    variation_amount: "1500",
                    validity: "30 Days"
                },

                {
                    variation_code: "MTN-3GB-M",
                    name: "3GB Monthly Data",
                    variation_amount: "2000",
                    validity: "30 Days"
                },

                {
                    variation_code: "MTN-5GB-M",
                    name: "5GB Monthly Data",
                    variation_amount: "3000",
                    validity: "30 Days"
                },

                {
                    variation_code: "MTN-10GB-M",
                    name: "10GB Monthly Data",
                    variation_amount: "5000",
                    validity: "30 Days"
                },

                {
                    variation_code: "MTN-15GB-M",
                    name: "15GB Monthly Data",
                    variation_amount: "7000",
                    validity: "30 Days"
                },

                {
                    variation_code: "MTN-20GB-M",
                    name: "20GB Monthly Data",
                    variation_amount: "9000",
                    validity: "30 Days"
                },

                {
                    variation_code: "MTN-25GB-M",
                    name: "25GB Monthly Data",
                    variation_amount: "11000",
                    validity: "30 Days"
                },

                {
                    variation_code: "MTN-30GB-M",
                    name: "30GB Monthly Data",
                    variation_amount: "13000",
                    validity: "30 Days"
                },

                {
                    variation_code: "MTN-40GB-M",
                    name: "40GB Monthly Data",
                    variation_amount: "16000",
                    validity: "30 Days"
                },

                {
                    variation_code: "MTN-50GB-M",
                    name: "50GB Monthly Data",
                    variation_amount: "20000",
                    validity: "30 Days"
                }

            ],


            airtel: [

                {
                    variation_code: "AIRTEL-100MB",
                    name: "100MB Daily Data",
                    variation_amount: "100",
                    validity: "1 Day"
                },

                {
                    variation_code: "AIRTEL-200MB",
                    name: "200MB Daily Data",
                    variation_amount: "180",
                    validity: "1 Day"
                },

                {
                    variation_code: "AIRTEL-500MB",
                    name: "500MB Daily Data",
                    variation_amount: "300",
                    validity: "1 Day"
                },

                {
                    variation_code: "AIRTEL-1GB-D",
                    name: "1GB Daily Data",
                    variation_amount: "500",
                    validity: "1 Day"
                },

                {
                    variation_code: "AIRTEL-1GB-W",
                    name: "1GB Weekly Data",
                    variation_amount: "800",
                    validity: "7 Days"
                },

                {
                    variation_code: "AIRTEL-2GB-W",
                    name: "2GB Weekly Data",
                    variation_amount: "1200",
                    validity: "7 Days"
                },

                {
                    variation_code: "AIRTEL-3GB-W",
                    name: "3GB Weekly Data",
                    variation_amount: "1500",
                    validity: "7 Days"
                },

                {
                    variation_code: "AIRTEL-5GB-W",
                    name: "5GB Weekly Data",
                    variation_amount: "2500",
                    validity: "7 Days"
                },

                {
                    variation_code: "AIRTEL-1GB-M",
                    name: "1GB Monthly Data",
                    variation_amount: "1000",
                    validity: "30 Days"
                },

                {
                    variation_code: "AIRTEL-2GB-M",
                    name: "2GB Monthly Data",
                    variation_amount: "1500",
                    validity: "30 Days"
                },

                {
                    variation_code: "AIRTEL-3GB-M",
                    name: "3GB Monthly Data",
                    variation_amount: "2000",
                    validity: "30 Days"
                },

                {
                    variation_code: "AIRTEL-5GB-M",
                    name: "5GB Monthly Data",
                    variation_amount: "3000",
                    validity: "30 Days"
                },

                {
                    variation_code: "AIRTEL-10GB-M",
                    name: "10GB Monthly Data",
                    variation_amount: "5000",
                    validity: "30 Days"
                },

                {
                    variation_code: "AIRTEL-15GB-M",
                    name: "15GB Monthly Data",
                    variation_amount: "7000",
                    validity: "30 Days"
                },

                {
                    variation_code: "AIRTEL-20GB-M",
                    name: "20GB Monthly Data",
                    variation_amount: "9000",
                    validity: "30 Days"
                },

                {
                    variation_code: "AIRTEL-25GB-M",
                    name: "25GB Monthly Data",
                    variation_amount: "11000",
                    validity: "30 Days"
                },

                {
                    variation_code: "AIRTEL-30GB-M",
                    name: "30GB Monthly Data",
                    variation_amount: "13000",
                    validity: "30 Days"
                },

                {
                    variation_code: "AIRTEL-40GB-M",
                    name: "40GB Monthly Data",
                    variation_amount: "16000",
                    validity: "30 Days"
                },

                {
                    variation_code: "AIRTEL-50GB-M",
                    name: "50GB Monthly Data",
                    variation_amount: "20000",
                    validity: "30 Days"
                }

            ],


            glo: [

                {
                    variation_code: "GLO-100MB",
                    name: "100MB Daily Data",
                    variation_amount: "100",
                    validity: "1 Day"
                },

                {
                    variation_code: "GLO-200MB",
                    name: "200MB Daily Data",
                    variation_amount: "180",
                    validity: "1 Day"
                },

                {
                    variation_code: "GLO-500MB",
                    name: "500MB Daily Data",
                    variation_amount: "300",
                    validity: "1 Day"
                },

                {
                    variation_code: "GLO-1GB-D",
                    name: "1GB Daily Data",
                    variation_amount: "500",
                    validity: "1 Day"
                },

                {
                    variation_code: "GLO-1GB-W",
                    name: "1GB Weekly Data",
                    variation_amount: "800",
                    validity: "7 Days"
                },

                {
                    variation_code: "GLO-2GB-W",
                    name: "2GB Weekly Data",
                    variation_amount: "1200",
                    validity: "7 Days"
                },

                {
                    variation_code: "GLO-3GB-W",
                    name: "3GB Weekly Data",
                    variation_amount: "1500",
                    validity: "7 Days"
                },

                {
                    variation_code: "GLO-5GB-W",
                    name: "5GB Weekly Data",
                    variation_amount: "2500",
                    validity: "7 Days"
                },

                {
                    variation_code: "GLO-1GB-M",
                    name: "1GB Monthly Data",
                    variation_amount: "1000",
                    validity: "30 Days"
                },

                {
                    variation_code: "GLO-2GB-M",
                    name: "2GB Monthly Data",
                    variation_amount: "1500",
                    validity: "30 Days"
                },

                {
                    variation_code: "GLO-3GB-M",
                    name: "3GB Monthly Data",
                    variation_amount: "2000",
                    validity: "30 Days"
                },

                {
                    variation_code: "GLO-5GB-M",
                    name: "5GB Monthly Data",
                    variation_amount: "3000",
                    validity: "30 Days"
                },

                {
                    variation_code: "GLO-10GB-M",
                    name: "10GB Monthly Data",
                    variation_amount: "5000",
                    validity: "30 Days"
                },

                {
                    variation_code: "GLO-15GB-M",
                    name: "15GB Monthly Data",
                    variation_amount: "7000",
                    validity: "30 Days"
                },

                {
                    variation_code: "GLO-20GB-M",
                    name: "20GB Monthly Data",
                    variation_amount: "9000",
                    validity: "30 Days"
                },

                {
                    variation_code: "GLO-25GB-M",
                    name: "25GB Monthly Data",
                    variation_amount: "11000",
                    validity: "30 Days"
                },

                {
                    variation_code: "GLO-30GB-M",
                    name: "30GB Monthly Data",
                    variation_amount: "13000",
                    validity: "30 Days"
                },

                {
                    variation_code: "GLO-40GB-M",
                    name: "40GB Monthly Data",
                    variation_amount: "16000",
                    validity: "30 Days"
                },

                {
                    variation_code: "GLO-50GB-M",
                    name: "50GB Monthly Data",
                    variation_amount: "20000",
                    validity: "30 Days"
                }

            ],


            "9mobile": [

                {
                    variation_code: "9MOBILE-100MB",
                    name: "100MB Daily Data",
                    variation_amount: "100",
                    validity: "1 Day"
                },

                {
                    variation_code: "9MOBILE-200MB",
                    name: "200MB Daily Data",
                    variation_amount: "180",
                    validity: "1 Day"
                },

                {
                    variation_code: "9MOBILE-500MB",
                    name: "500MB Daily Data",
                    variation_amount: "300",
                    validity: "1 Day"
                },

                {
                    variation_code: "9MOBILE-1GB-D",
                    name: "1GB Daily Data",
                    variation_amount: "500",
                    validity: "1 Day"
                },

                {
                    variation_code: "9MOBILE-1GB-W",
                    name: "1GB Weekly Data",
                    variation_amount: "800",
                    validity: "7 Days"
                },

                {
                    variation_code: "9MOBILE-2GB-W",
                    name: "2GB Weekly Data",
                    variation_amount: "1200",
                    validity: "7 Days"
                },

                {
                    variation_code: "9MOBILE-3GB-W",
                    name: "3GB Weekly Data",
                    variation_amount: "1500",
                    validity: "7 Days"
                },

                {
                    variation_code: "9MOBILE-5GB-W",
                    name: "5GB Weekly Data",
                    variation_amount: "2500",
                    validity: "7 Days"
                },

                {
                    variation_code: "9MOBILE-1GB-M",
                    name: "1GB Monthly Data",
                    variation_amount: "1000",
                    validity: "30 Days"
                },

                {
                    variation_code: "9MOBILE-2GB-M",
                    name: "2GB Monthly Data",
                    variation_amount: "1500",
                    validity: "30 Days"
                },

                {
                    variation_code: "9MOBILE-3GB-M",
                    name: "3GB Monthly Data",
                    variation_amount: "2000",
                    validity: "30 Days"
                },

                {
                    variation_code: "9MOBILE-5GB-M",
                    name: "5GB Monthly Data",
                    variation_amount: "3000",
                    validity: "30 Days"
                },

                {
                    variation_code: "9MOBILE-10GB-M",
                    name: "10GB Monthly Data",
                    variation_amount: "5000",
                    validity: "30 Days"
                },

                {
                    variation_code: "9MOBILE-15GB-M",
                    name: "15GB Monthly Data",
                    variation_amount: "7000",
                    validity: "30 Days"
                },

                {
                    variation_code: "9MOBILE-20GB-M",
                    name: "20GB Monthly Data",
                    variation_amount: "9000",
                    validity: "30 Days"
                },

                {
                    variation_code: "9MOBILE-25GB-M",
                    name: "25GB Monthly Data",
                    variation_amount: "11000",
                    validity: "30 Days"
                },

                {
                    variation_code: "9MOBILE-30GB-M",
                    name: "30GB Monthly Data",
                    variation_amount: "13000",
                    validity: "30 Days"
                },

                {
                    variation_code: "9MOBILE-40GB-M",
                    name: "40GB Monthly Data",
                    variation_amount: "16000",
                    validity: "30 Days"
                },

                {
                    variation_code: "9MOBILE-50GB-M",
                    name: "50GB Monthly Data",
                    variation_amount: "20000",
                    validity: "30 Days"
                }

            ]

        };


        const selectedPlans = dataPlans[network] || dataPlans.mtn;


        console.log("================================");
        console.log("MOCK DATA PLANS");
        console.log("NETWORK:", network);
        console.log("TOTAL PLANS:", selectedPlans.length);
        console.log("================================");


        return {

            success: true,

            data: {

                code: "000",

                response_description: "Successful",

                content: {

                    variations: selectedPlans

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
                            variation_code: "DSTV-BASIC",
                            name: "DStv Basic",
                            variation_amount: "5000",
                            validity: "30 Days"
                        },

                        {
                            variation_code: "DSTV-FAMILY",
                            name: "DStv Family",
                            variation_amount: "9000",
                            validity: "30 Days"
                        },

                        {
                            variation_code: "DSTV-COMPACT",
                            name: "DStv Compact",
                            variation_amount: "15000",
                            validity: "30 Days"
                        },

                        {
                            variation_code: "DSTV-COMPACTPLUS",
                            name: "DStv Compact Plus",
                            variation_amount: "25000",
                            validity: "30 Days"
                        },

                        {
                            variation_code: "DSTV-PREMIUM",
                            name: "DStv Premium",
                            variation_amount: "37000",
                            validity: "30 Days"
                        },

                        {
                            variation_code: "GOTV-JOLLI",
                            name: "GOtv Jolli",
                            variation_amount: "4900",
                            validity: "30 Days"
                        },

                        {
                            variation_code: "GOTV-MAX",
                            name: "GOtv Max",
                            variation_amount: "7200",
                            validity: "30 Days"
                        },

                        {
                            variation_code: "GOTV-SMALLIE",
                            name: "GOtv Smallie",
                            variation_amount: "1500",
                            validity: "30 Days"
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

            response_description: "Transaction Successful",

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