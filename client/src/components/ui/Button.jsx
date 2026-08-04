function Button({

    children,

    type = "button",

    onClick,

    loading = false,

    className = "",

    disabled = false

}) {

    return (

        <button

            type={type}

            onClick={onClick}

            disabled={loading || disabled}

            className={`
                w-full
                py-3
                rounded-lg
                font-bold
                text-white
                transition
                duration-300
                ${loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"}
                ${className}
            `}

        >

            {loading ? "Processing..." : children}

        </button>

    );

}

export default Button;