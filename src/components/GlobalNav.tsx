function GlobalNav() {
  return (
    <>
      <nav>
        <h2 className="h2-navbar" onClick={() => window.location.reload()} >byHarsa</h2>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1">About</a>
        <a href="/">Home</a>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1">Contact</a>
      </nav>
    </>
  );
}

export default GlobalNav;
