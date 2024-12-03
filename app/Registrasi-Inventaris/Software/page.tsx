const SoftwarePage = () => {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Perangkat Software</h1>
        <p className="mb-4">Halaman untuk registrasi Software.</p>
        
        {/* Add your form or content here */}
        <form className="space-y-4">
          <div>
            <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700">Nama Perangkat</label>
            <input type="text" id="deviceName" name="deviceName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Nomor Seri</label>
            <input type="text" id="serialNumber" name="serialNumber" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Daftar Perangkat</button>
        </form>
      </div>
    );
  };
  
  export default SoftwarePage;