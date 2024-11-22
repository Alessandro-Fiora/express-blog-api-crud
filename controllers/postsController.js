const posts = require("../db/posts");

// INDEX
function index(req, res) {
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
  const { title, content, img, tags } = req.body;
  const id = posts.at(-1).id + 1;

  // Controllo se ci sono tutti i parametri
  if (!title || !content || !img || !Array.isArray(tags) || !tags?.length) {
    res.status(400).json({
      error: "Invalid data",
    });
  }

  const post = { id, title, content, img, tags };

  posts.push(post);
  res.json(posts);
}

// UPDATE
function update(req, res) {
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

  const { title, content, img, tags } = req.body;

  // Controllo se ci sono tutti i parametri
  if (!title || !content || !img || !Array.isArray(tags) || !tags?.length) {
    res.status(400).json({
      error: "Invalid data",
    });
  }

  post.title = title;
  post.content = content;
  post.img = img;
  post.tags = tags;

  res.sendStatus(204);
}

// MODIFY
function modify(req, res) {
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

  const { title, content, img, tags } = req.body;

  if (title) {
    post.title = title;
  }
  if (content) {
    post.content = content;
  }
  if (img) {
    post.img = img;
  }
  if (Array.isArray(tags) && tags?.length) {
    post.tags = tags;
  }

  res.sendStatus(204);
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

  // Stampo in console l'elemento eliminato
  console.log("Elemento eliminato: ", deleted);

  // Cancello l'elemento dall'array
  posts.splice(posts.indexOf(deleted), 1);

  // Stampo in console la lista aggiornata
  console.log("Lista aggiornata: ", posts);

  // Ritorno alla chiamata uno stato 204
  res.sendStatus(204);
}

module.exports = { index, show, store, update, modify, destroy };
