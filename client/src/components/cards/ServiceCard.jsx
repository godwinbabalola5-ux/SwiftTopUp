import { Link } from "react-router-dom";

function ServiceCard({

    to,

    icon,

    title,

    color = "hover:bg-blue-50"

}) {

    return (

        <Link

            to={to}

            className={`bg-white shadow-lg rounded-xl p-6 transition ${color}`}

        >

            <div className="text-4xl">

                {icon}

            </div>

            <h3 className="font-bold mt-3">

                {title}

            </h3>

        </Link>

    );

}

export default ServiceCard;