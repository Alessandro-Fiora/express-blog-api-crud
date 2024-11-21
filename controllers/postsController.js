const posts = require("../db/posts");

// INDEX
function index(req, res) {
  console.log("Richiesta index posts");

  // FILTRO POST PER KEYWORD NEI TAGS
  let filteredPosts = posts;

  // SE C'E' UNA KEY DO A TERM IL VALORE DELLA KEY, ALTRIMENTI DO VALORE NULLO
  const term = req.query.term ?? "";

  // SE TERM HA UN VALORE FILTRO I POST PER QUELLI CHE INCLUDONO IL VALORE TRA I TAG
  if (term) {
    filteredPosts = posts.filter((post) => {
      let isTermIncluded = false;
      // PER OGNI POST CONTROLLO SE OGNI TAG CONTIENE TERM
      post.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(term.toLowerCase()))
          isTermIncluded = true;
      });
      return isTermIncluded;
    });
  }

  res.json({ filteredPosts, postNumber: filteredPosts.length });
}

// SHOW
function show(req, res) {
  const id = parseInt(req.params.id);

  // Controllo per ID non valido
  if (isNaN(id)) {
    return res.status(400).json({
      error: "id not valid",
    });
  }

  const post = posts.find((post) => post.id === id);

  // Controllo per ID non presente nella lista
  if (!post) {
    return res.status(404).json({
      error: "Resource not found",
    });
  }

  res.json(post);
}

// STORE
function store(req, res) {
  res.json("Crea nuovo post");
}

// UPDATE
function update(req, res) {
  const id = parseInt(req.params.id);
  res.json(`Modifica integrale del post ${id}`);
}

// MODIFY
function modify(req, res) {
  const id = parseInt(req.params.id);
  res.json(`Modifica parziale del post ${id}`);
}

// DESTROY
function destroy(req, res) {
  const id = parseInt(req.params.id);

  // Controllo per ID non valido
  if (isNaN(id)) {
    return res.status(400).json({
      error: "id not valid",
    });
  }

  // Salvo l'elemento che sto eliminando e lo cerco nell'array
  const deleted = posts.find((post, index) => post.id === id);
  // Controllo per ID non presente nella lista
  if (!deleted) {
    return res.status(404).json({
      error: "Resource not found",
    });
  }
  // Cancello l'elemento dall'array
  posts.splice(posts.indexOf(deleted), 1);

  // Ritorno alla chiamata sia l'elemento eliminato che il nuovo array di elementi
  res.json({
    deleted,
    posts,
  });
}

module.exports = { index, show, store, update, modify, destroy };
