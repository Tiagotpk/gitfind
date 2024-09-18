import { Header } from "../../components/Header";
import background from "../../assets/githubcat.svg";
import ItemList from "../../components/ItemList/index.jsx";
import "./styles.css";
import { useState } from "react";

function App() {
  const [user, setUser] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const reposPerPage = 5; 

  const handlerGetData = async () => {
    const userData = await fetch(`https://api.github.com/users/${user}`);
    const newUser = await userData.json();

    if (newUser.name) {
      const { avatar_url, name, bio } = newUser;
      setCurrentUser({ avatar_url, name, bio });

      const reposData = await fetch(
        `https://api.github.com/users/${user}/repos`
      );
      const newRepos = await reposData.json();

      if (newRepos.length) {
        setRepos(newRepos);
        setCurrentPage(1); 
      }
    }
  };

  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo);

  const nextPage = () => {
    if (currentPage < Math.ceil(repos.length / reposPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="content">
        <img src={background} alt="Gato do github" className="background" />
        <div className="info">
          <div className="search-container">
            <input
              type="text"
              value={user}
              onChange={(event) => setUser(event.target.value)}
              name="usuario"
              placeholder="@username"
            />
            <button onClick={handlerGetData}>Buscar</button>
          </div>
          {currentUser && currentUser.name ? (
            <>
              <div className="perfil">
                <img
                  src={currentUser.avatar_url}
                  alt="imagem perfil"
                  className="profile"
                />
                <div>
                  <h3>{currentUser.name}</h3>
                  <span>@{user}</span>
                  <p>{currentUser.bio}</p>
                </div>
              </div>
              <hr />
            </>
          ) : null}
          <div>
            <h4 className="repositorio">Repositórios</h4>
            {currentRepos.length ? (
              <>
                {currentRepos.map((repo, index) => (
                  <ItemList key={index} title={repo.name} description={repo.description} />
                ))}
                <div className="pagination">
                  <button onClick={prevPage} disabled={currentPage === 1}>
                    Anterior
                  </button>
                  <span>Página {currentPage}</span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= Math.ceil(repos.length / reposPerPage)}
                  >
                    Próximo
                  </button>
                </div>
              </>
            ) : (
              <p>Nenhum repositório encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
