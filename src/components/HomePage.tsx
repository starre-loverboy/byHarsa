import GAMELIST from "./GAMELIST";
import GameBox from "./GameBox";
import GlobalNav from "./GlobalNav";
import GlobalFooter from "./GlobalFooter";

function HomePage() {
  return (
    <>
      <GlobalNav />
      <header>
        <h1 className="welcome-h1">Welcome to byHarsa</h1>
        <section className="about-section">
          <p>byHarsa is a personal project by me,</p>
          <p>Where i share and learn projects.</p>
          <p>Thanks for the support.</p>
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1">See More</a>
        </section>
      </header>
      <main>
        <h2 id="playground-h2">PlayGround!</h2>
        <section className="section-tab">
          <div className="game-grid">
            {GAMELIST.map((game) => (
              <GameBox
                key={game.id}
                path={game.path}
                img={game.img}
              />
            ))}
          </div>
        </section>
      </main>
      <GlobalFooter />
    </>
  );
}

export default HomePage;
