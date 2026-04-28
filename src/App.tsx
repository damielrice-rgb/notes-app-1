import { useState, useEffect } from 'react'
import './App.css'

type Note = {
  _id: string;
  title: string;
  content: string
};

const getUserId = () => {
  let userId = localStorage.getItem("userId");

  if(!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("userId", userId);
  }
  return userId;
};

const userId = getUserId();

export function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`https://notes-app-1-dyqx.onrender.com/api/notes?userId=${userId}`);
        const data = await res.json();
        setNotes(data);
        setIsLoaded(true);
      } catch (err){
        console.log(err);
      }
    };

    fetchNotes();
}, []);

// useEffect(() => {
  // if(isLoaded) {
   // localStorage.setItem('notes', JSON.stringify(notes));
 // }
// }, [notes, isLoaded]);


  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();

    const newNote= {
      title,
      content,
      userId,
    };

    try {
      const res = await fetch("https://notes-app-1-dyqx.onrender.com/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      if(!res.ok ) {
        throw new Error("Failed to save note");
      }

      const savedNote = await res.json();

       setNotes([savedNote, ...notes]);
    setTitle("");
    setContent("");
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteNote(id: string) {
    try {
      const res = await fetch(`https://notes-app-1-dyqx.onrender.com/api/notes/${id}`, {
        method: "DELETE",
      });

      if(!res.ok) {
        throw new Error("Failed to delete note");
      }

    setNotes(notes.filter(note => 
      note._id !== id));
  }catch (err) {
    console.log(err);
  }
  }
  

  function handleNoteClick(note: Note) {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  async function handleUpdatedNote(e: React.FormEvent){
    e.preventDefault();

    if(!selectedNote) return;

    try {
      const res = await fetch(`https://notes-app-1-dyqx.onrender.com/api/notes/${selectedNote._id}`, {
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          title,
          content,
          userId,
        }),
      });

      if(!res.ok) {
        throw new Error("Failed to update note");
      }

      const updatedNote = await res.json();

   // const updatedNote: Note = {
     // id: selectedNote.id,
     // title,
      //content,
   // };

   setNotes(notes.map((note) =>
      note._id === selectedNote._id ? updatedNote : note
    ));

    setSelectedNote(null);
    setTitle("");
    setContent("");
  } catch (err) {
    console.log(err);
  }
}

    function handleCancel() {
      setSelectedNote(null);
      setTitle("");
      setContent("");
    }

  return (
    <div className="app-container min-h-screen bg-gray-100 p-6 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
      <form className="note-form bg-white p-4 rounded-xl shadow flex flex-col gap-3"
      onSubmit={(e) => 
        selectedNote ? handleUpdatedNote(e) : handleAddNote(e)
      }>
        
        <input 
        required
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Title"
        value={title} 
        onChange={(e) => {
          setTitle(e.target.value)
        }}/>

        <textarea 
        required
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Content" 
        rows={10}
        value={content} 
        onChange={(e) => {
          setContent(e.target.value)
        }}/>

        {selectedNote ? (
          <div className="flex gap-2">
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
        <button 
        type="submit"
        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Add Note
          </button>
          )}

      </form>

      <div className="notes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => {
          return(

           <div key={note._id} 
  className={`note-item bg-white p-4 rounded-xl shadow hover:shadow-lg transition ${
    selectedNote?._id === note._id ? 'ring-2 ring-indigo-400' : ''
  }`}
           onClick={() => {
            handleNoteClick(note)
           }}>

          <div className="notes-header flex justify-end mt-4">
            
            <button className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteNote(note._id)
            }}
            >
              X
              </button>
          
          </div>

          <h2 className="font-bold text-lg">
            {note.title}</h2>
          <p className="text-gray-600 mt-2">
            {note.content}</p>
        </div>
          );

        })}
       
      </div>
      </div>
  );
}

export default App
