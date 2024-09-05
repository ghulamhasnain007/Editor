import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css'; // Import Quill's styles
import axios from "axios";

// Dynamically load ReactQuill with no SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Quill modules (for toolbar configuration)
const modules = {
  toolbar: {
    container: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
    handlers: {
      image: () => {} // Custom image handler (defined below)
    }
  },
};

// Quill formats (for formatting configuration)
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

const BlogEditor: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const quillRef = useRef<any>(null); // Use "any" type to access getEditor later

  // Handle editor content change
  const handleEditorChange = (value: string) => {
    setContent(value);
  };

  // Handle custom image upload
  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        // Upload the image via API
        const res = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Get the Quill editor instance
        const editor = quillRef.current.getEditor(); // Access the Quill editor instance
        const range = editor.getSelection();
        if (range) {
          editor.insertEmbed(range.index, 'image', res.data.path); // Insert the image URL
        }
      } catch (err) {
        console.error("Image upload failed", err);
      }
    };
  };

  // Submit blog content
  const submitBlog = async () => {
    try {
      await axios.post("/api/blog", { content });
      console.log("Blog saved");
    } catch (error) {
      console.error("Error saving blog", error);
    }
  };

  // Add the custom image handler to Quill's modules configuration
  const customModules = {
    ...modules,
    toolbar: {
      ...modules.toolbar,
      handlers: {
        ...modules.toolbar.handlers,
        image: handleImageUpload // Use custom image upload handler
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <ReactQuill
        ref={quillRef} // Attach the Quill reference to access the editor
        value={content}
        onChange={handleEditorChange}
        modules={customModules} // Use custom modules with the image handler
        formats={formats}
        theme="snow"
      />
      <button
        onClick={submitBlog}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Submit
      </button>
    </div>
  );
};

export default BlogEditor;
