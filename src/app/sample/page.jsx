'use client'
import { useState } from "react"
import axios from "axios"

const Sample = () => {
    const [files, setFiles] = useState([null, null, null, null]);
    const [previews, setPreviews] = useState([null, null, null, null]);

    const handleImg = (e, index) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const newFiles = [...files];
        const newPreviews = [...previews];
        newFiles[index] = selectedFile;
        newPreviews[index] = URL.createObjectURL(selectedFile);

        setFiles(newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = async () => {
          // Count how many files are selected
      const selectedCount = files.filter(f => f !== null).length;
      if (selectedCount < 2) return alert('Please upload at least 2 images');
         
        const formData = new FormData();
        files.forEach((file, i) => {
            if (file) {
                formData.append(`image${i + 1}`, file);
            }
        });

        try {
            const res = await axios.post('/api/samUpload', formData);
            console.log("Uploaded:", res.data);
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    return (
        <>
   
<div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

<span class="relative flex h-3 w-3">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
</span>

<div class="w-4 h-4 bg-gray-400 rounded-full animate-pulse"></div>


<div class="animate-bounce text-3xl">⬇️</div>

<div className="p-4 flex flex-col gap-4">
            {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">

                    {previews[i] && <img src={previews[i]} alt={`Preview ${i + 1}`} className="w-16 h-16 object-cover" />}

                    <input type="file" id={`file-${i}`} className="hidden" onChange={(e) => handleImg(e, i)}/>
                    <label htmlFor={`file-${i}`} className="cursor-pointer bg-gray-200 px-2 py-1 rounded">
                       Upload Image {i + 1}
                    </label>
                </div>
            ))}
            <button onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">Submit All</button>
        </div>
        </>
        
    );
};

export default Sample;

