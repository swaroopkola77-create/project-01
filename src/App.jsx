import "./App.css";
import {BrowserRouter, Routes, Route, Link, useParams} from "react-router-dom";
const blogs = [
{id: 1, title: "React Basics", content: "This is React blog content."}, {id: 2, title: "JavaScript Tips", content: "This is JavaScript blog content."}
];
function BlogList(){
return (
<div className="container">
<h2>Blog List</h2>
{blogs.map(blog => (
<div key={blog.id}>
<Link to={`/blog/${blog.id}`}>{blog.title}</Link>
</div>
))}
</div>
);
}
function BlogDetails(){
const {id} = useParams();
const blog = blogs.find(b => b.id === parseInt(id));
return (
<div className="container">
<h2>{blog.title}</h2>
<p>{blog.content}</p>
<Link to="/">Back</Link>
</div>
);
}
export default function App(){
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<BlogList/>}/>
<Route path="/blog/:id" element={<BlogDetails/>}/>
</Routes>
</BrowserRouter>
);
}