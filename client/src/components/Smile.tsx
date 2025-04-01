const Smile = ({ size = 280, fillColor = "#4A5565", strokeColor = "none" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280ZM86 131C93.732 131 100 124.732 100 117C100 109.268 93.732 103 86 103C78.268 103 72 109.268 72 117C72 124.732 78.268 131 86 131ZM208 119C208 126.732 201.732 133 194 133C186.268 133 180 126.732 180 119C180 111.268 186.268 105 194 105C201.732 105 208 111.268 208 119ZM69 168H211.99C211.528 190.689 179.696 209 140.495 209C101.294 209 69.4615 190.689 69 168Z"
            fill={fillColor}
            stroke={strokeColor}
        />
    </svg>
);

export default Smile;
