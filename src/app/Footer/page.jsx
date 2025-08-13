const Footer = () => {
  return (
    <footer className="bg-white shadow-2xl w-[90%] mx-auto mt-10 mb-2 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
     
        <div>
          <h1 className="text-2xl font-bold text-orange-500 mb-2">Quick Card</h1>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, suscipit.
          </p>
        </div>

  
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Brands</h2>
          <ul className="space-y-1 text-sm text-gray-600">
            <li><a href="#" className="hover:text-orange-500 transition">Home</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">About</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Shop</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Contact</a></li>
          </ul>
        </div>


        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Get in Touch</h2>
          <p className="text-sm text-gray-600">📞 +01 09999210</p>
          <p className="text-sm text-gray-600">📧 example@gmail.com</p>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4 text-center text-sm text-gray-500 mb-2">
        © {new Date().getFullYear()} Quick Card. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
