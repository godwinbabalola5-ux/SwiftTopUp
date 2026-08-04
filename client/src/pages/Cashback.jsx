import React, { useEffect, useState } from "react";
import "./Cashback.css";

const Cashback = () => {

    const [cashbackData, setCashbackData] = useState({
        totalEarned: 0,
        cashbackBalance: 0,
        history: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const loadCashback = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:3000/api/cashback/history",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to load cashback."
                );
            }

            setCashbackData({
                totalEarned: Number(data.totalEarned || 0),
                cashbackBalance: Number(data.cashbackBalance || 0),
                history: data.history || []
            });

        } catch (error) {

            console.error("Cashback Error:", error);

            setError(
                error.message ||
                "Unable to load cashback history."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (!token) {
            setError("You are not logged in.");
            setLoading(false);
            return;
        }

        loadCashback();

    }, [token]);


    const getServiceIcon = (type) => {

        switch (type?.toLowerCase()) {

            case "airtime":
                return "📱";

            case "data":
                return "📶";

            case "cable":
                return "📺";

            case "electricity":
                return "💡";

            default:
                return "🎁";

        }

    };


    const formatDate = (date) => {

        if (!date) return "Unknown date";

        return new Date(date).toLocaleString(
            "en-NG",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };


    if (loading) {

        return (
            <div className="cashback-page">

                <div className="cashback-loading">

                    <div className="cashback-spinner"></div>

                    <p>Loading cashback...</p>

                </div>

            </div>
        );

    }


    return (

        <div className="cashback-page">

            <div className="cashback-container">

                {/* HEADER */}

                <div className="cashback-header">

                    <div>

                        <p className="cashback-label">
                            Rewards
                        </p>

                        <h1>
                            Cashback
                        </h1>

                        <p>
                            Earn 2% cashback whenever you make
                            eligible purchases.
                        </p>

                    </div>

                    <div className="cashback-gift">
                        🎁
                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="cashback-error">

                        ⚠️ {error}

                        <button
                            onClick={loadCashback}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* SUMMARY CARDS */}

                <div className="cashback-summary">

                    <div className="cashback-card balance-card">

                        <div className="cashback-card-icon">
                            💰
                        </div>

                        <div>

                            <span>
                                Cashback Balance
                            </span>

                            <h2>
                                ₦
                                {cashbackData.cashbackBalance.toLocaleString(
                                    "en-NG",
                                    {
                                        minimumFractionDigits: 2
                                    }
                                )}
                            </h2>

                        </div>

                    </div>


                    <div className="cashback-card earned-card">

                        <div className="cashback-card-icon">
                            🏆
                        </div>

                        <div>

                            <span>
                                Total Earned
                            </span>

                            <h2>
                                ₦
                                {cashbackData.totalEarned.toLocaleString(
                                    "en-NG",
                                    {
                                        minimumFractionDigits: 2
                                    }
                                )}
                            </h2>

                        </div>

                    </div>

                </div>


                {/* HOW IT WORKS */}

                <div className="cashback-info">

                    <div className="cashback-info-icon">
                        ✨
                    </div>

                    <div>

                        <h3>
                            How cashback works
                        </h3>

                        <p>
                            You automatically receive 2% cashback
                            when you successfully purchase eligible
                            services like airtime, data, cable and
                            electricity.
                        </p>

                    </div>

                </div>


                {/* HISTORY */}

                <div className="cashback-history-section">

                    <div className="cashback-section-header">

                        <div>

                            <h2>
                                Cashback History
                            </h2>

                            <p>
                                Your recent cashback rewards
                            </p>

                        </div>

                        <span className="history-count">
                            {cashbackData.history.length}
                        </span>

                    </div>


                    {cashbackData.history.length === 0 ? (

                        <div className="empty-cashback">

                            <div>
                                🎁
                            </div>

                            <h3>
                                No cashback yet
                            </h3>

                            <p>
                                Make your first eligible purchase
                                and start earning cashback.
                            </p>

                        </div>

                    ) : (

                        <div className="cashback-list">

                            {cashbackData.history.map(
                                (item) => (

                                    <div
                                        className="cashback-history-item"
                                        key={item.id}
                                    >

                                        <div className="service-icon">

                                            {getServiceIcon(
                                                item.transaction_type
                                            )}

                                        </div>


                                        <div className="cashback-history-details">

                                            <h3>

                                                {item.transaction_type
                                                    ? item.transaction_type
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                      item.transaction_type
                                                        .slice(1)
                                                    : "Service"}

                                            </h3>

                                            <p>
                                                {item.customer ||
                                                    "Transaction"}
                                            </p>

                                            <small>
                                                {formatDate(
                                                    item.created_at
                                                )}
                                            </small>

                                        </div>


                                        <div className="cashback-history-amount">

                                            <strong>
                                                +₦
                                                {Number(
                                                    item.amount
                                                ).toLocaleString(
                                                    "en-NG",
                                                    {
                                                        minimumFractionDigits: 2
                                                    }
                                                )}
                                            </strong>

                                            <small>
                                                Cashback
                                            </small>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};

export default Cashback;