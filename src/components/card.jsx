
import Link from 'next/link';

const Card = ({ data }) => {
    // console.log(data);
    return (
        <>
     {data && data.map((value, i) => (
      <div key={i} className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">

      <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
          <img src={value.imageUrl[0]} alt={value.productName} className="h-full object-contain"/>
      </div>

    <div className="mt-4">
        <h2 className="font-semibold text-lg text-gray-800 truncate">{value.productName}</h2>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{value.productDesc}</p>
    <div className="mt-3 flex justify-between items-center">
      <div>
        <p className="text-orange-600 font-bold text-lg">
          ${value.productPrice - (value.productOffer || 0)}
        </p>
        {value.productOffer > 0 && (
          <p className="text-xs text-gray-500 line-through">
            ${value.productPrice}
          </p>
        )}
      </div>

      <Link href={`/BuyPage/${value._id}`}>
        <button className="px-3 py-1.5 cursor-pointer bg-orange-500 text-white text-sm rounded-full hover:bg-orange-600 transition"> Buy Now</button>
      </Link>
    </div>
  </div>
</div>

    ))}
        </>
    );
};

export default Card;
