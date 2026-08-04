function AdminStatCard({ title, value, color }) {
    return (
        <div className={`rounded-2xl p-6 text-white shadow-xl ${color}`}>
            <h3 className="text-lg font-semibold opacity-90">
                {title}
            </h3>

            <h1 className="text-4xl font-bold mt-4">
                {value}
            </h1>
        </div>
    );
}

export default AdminStatCard;