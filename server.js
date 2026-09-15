const express = require("express");
const session = require("express-session");
const app = express();

app.use(express.static("public"));
app.use(session({ secret: "hopekoncept-secret", resave: false, saveUninitialized: false }));

const ADMIN_PASS = "hope2026";
let articles = [
    { id: 1, title: "Major Infrastructure Project Commissioned to Boost Regional Transit", excerpt: "New transport and road expansion initiatives kick off to streamline commuter movement across urban hubs...", category: "Local News", time: "1 hour ago", comments: [{ id: 1, name: "Collins", text: "This is a much-needed development for commuters!" }] },
    { id: 2, title: "Tech Ecosystem Sees Surge in Mobile Development Solutions", excerpt: "Developers across regions leverage lightweight mobile environments for rapid web and app deployment...", category: "Technology", time: "3 hours ago", comments: [] }
];

let commentIdCounter = 2;
const categories = ["Local News", "Technology", "Science", "Sports", "Politics", "Entertainment", "Guinness World Record"];

app.get("/", (req, res) => {
    const category = req.query.category || "All";
    const search = (req.query.search || "").toLowerCase();
    let filtered = category === "All" ? articles : articles.filter(a => a.category === category);
    if (search) {
        filtered = filtered.filter(a => a.title.toLowerCase().includes(search) || a.excerpt.toLowerCase().includes(search));
    }
    let htmlCards = filtered.map((a) => `
        <article style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 16px;">
            <span style="font-size: 0.7rem; background: #b91c1c; color: #fff; padding: 2px 8px; font-weight: bold; text-transform: uppercase;">${a.category}</span>
            <h3 style="margin: 8px 0 6px 0; font-size: 1.15rem; color: #0f172a; font-family: Georgia, serif; line-height: 1.3;"><a href="/article/${a.id}" style="color: inherit; text-decoration: none;">${a.title}</a></h3>
            <p style="margin: 0 0 8px 0; font-size: 0.9rem; color: #475569; line-height: 1.4;">${a.excerpt}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #64748b;">
                <span>🕒 ${a.time}</span>
                <a href="/article/${a.id}" style="color: #b91c1c; font-weight: bold; text-decoration: none;">💬 Comments (${a.comments.length})</a>
            </div>
        </article>
    `).join("");

    let navLinks = `<a href="/">All</a>` + categories.map(c => `<a href="/?category=${encodeURIComponent(c)}">${c}</a>`).join("");

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hopekoncept News - Global & Local Feed</title>
    <style>
        body { font-family: Helvetica, Arial, sans-serif; margin: 0; background-color: #f1f5f9; color: #0f172a; position: relative; min-height: 100vh; }
        .bg-video-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: -2; }
        .bg-video-container video { width: 100%; height: 100%; object-fit: cover; }
        .bg-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.75); z-index: -1; }
        header { background-color: #000000; border-bottom: 4px solid #b91c1c; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }
        header h1 { margin: 0; color: #ffffff; font-size: 1.4rem; font-family: Georgia, serif; }
        .ticker-bar { background-color: #b91c1c; color: #fff; padding: 6px 20px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }
        .nav-bar { background-color: rgba(255, 255, 255, 0.95); padding: 10px 20px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 15px; overflow-x: auto; position: relative; z-index: 1; backdrop-filter: blur(5px); }
        .nav-bar a { color: #334155; text-decoration: none; font-size: 0.85rem; font-weight: bold; white-space: nowrap; }
        .nav-bar a:hover { color: #b91c1c; }
        .search-container { background: rgba(15, 23, 42, 0.85); padding: 12px 20px; display: flex; justify-content: center; position: relative; z-index: 1; }
        .search-container form { display: flex; width: 100%; max-width: 800px; gap: 8px; }
        .search-container input { flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 3px; font-size: 0.9rem; }
        .search-container button { background: #b91c1c; color: #fff; border: none; padding: 8px 16px; font-weight: bold; border-radius: 3px; cursor: pointer; }
        .container { max-width: 800px; margin: 20px auto; padding: 0 15px; position: relative; z-index: 1; }
        .main-feed { background: rgba(255, 255, 255, 0.92); padding: 20px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); backdrop-filter: blur(5px); }
        footer { text-align: center; padding: 25px; font-size: 0.8rem; background: #0f172a; color: #cbd5e1; margin-top: 40px; position: relative; z-index: 1; }
    </style>
</head>
<body>
    <div class="bg-video-container"><video autoplay muted loop playsinline><source src="https://assets.mixkit.co/videos/preview/mixkit-woman-reading-a-magazine-in-a-cozy-room-41617-large.mp4" type="video/mp4"></video></div>
    <div class="bg-overlay"></div>
    <header>
        <h1>HOPEKONCEPT NEWS</h1>
        <a href="/admin" style="color: #cbd5e1; font-size: 0.8rem; text-decoration: none; border: 1px solid #475569; padding: 4px 10px; border-radius: 3px;">Admin Panel</a>
    </header>
    <div class="ticker-bar"><span>Breaking News Feed &bull; Live Updates</span></div>
    <div class="search-container">
        <form action="/" method="GET">
            <input type="text" name="search" placeholder="Search news headlines or topics..." value="${search}">
            <button type="submit">Search</button>
        </form>
    </div>
    <div class="nav-bar">${navLinks}</div>
    <div class="container">
        <div class="main-feed">
            <h2 style="font-size: 1rem; text-transform: uppercase; border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin-top: 0;">Category: ${category}</h2>
            ${filtered.length === 0 ? '<p style="color: #64748b; text-align: center; padding: 30px;">No matching stories found.</p>' : htmlCards}
        </div>
    </div>
    <footer>&copy; 2026 Hopekoncept News Service. All rights reserved.</footer>
</body>
</html>
    `);
});

app.get("/article/:id", (req, res) => {
    const article = articles.find(a => a.id == req.params.id);
    if (!article) return res.status(404).send("Article not found");

    let commentList = article.comments.map(c => `
        <div style="background: #f8fafc; border-left: 3px solid #b91c1c; padding: 10px 15px; margin-bottom: 10px; border-radius: 2px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
                <strong style="font-size: 0.85rem; color: #0f172a;">${c.name}</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #334155;">${c.text}</p>
            </div>
            ${req.session.isAdmin ? '<form action="/article/' + article.id + '/comment/' + c.id + '/delete" method="POST" style="margin:0;"><button type="submit" style="background:#ef4444; color:#fff; border:none; padding:2px 6px; font-size:0.7rem; border-radius:3px; cursor:pointer;">Delete</button></form>' : ''}
        </div>
    `).join("") || '<p style="color: #64748b; font-size: 0.85rem;">No comments yet. Be the first to comment!</p>';

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} - Hopekoncept News</title>
    <style>
        body { font-family: Helvetica, Arial, sans-serif; margin: 0; background-color: #f1f5f9; color: #0f172a; }
        .bg-video-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: -2; }
        .bg-video-container video { width: 100%; height: 100%; object-fit: cover; }
        .bg-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.75); z-index: -1; }
        header { background-color: #000000; border-bottom: 4px solid #b91c1c; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
        header h1 { margin: 0; color: #ffffff; font-size: 1.4rem; font-family: Georgia, serif; }
        .container { max-width: 800px; margin: 30px auto; padding: 0 15px; }
        .article-box { background: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
        footer { text-align: center; padding: 25px; font-size: 0.8rem; background: #0f172a; color: #cbd5e1; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="bg-video-container"><video autoplay muted loop playsinline><source src="https://assets.mixkit.co/videos/preview/mixkit-woman-reading-a-magazine-in-a-cozy-room-41617-large.mp4" type="video/mp4"></video></div>
    <div class="bg-overlay"></div>
    <header>
        <h1>HOPEKONCEPT NEWS</h1>
        <a href="/" style="color: #cbd5e1; font-size: 0.8rem; text-decoration: none; border: 1px solid #475569; padding: 4px 10px; border-radius: 3px;">&larr; Back to Feed</a>
    </header>
    <div class="container">
        <div class="article-box">
            <span style="font-size: 0.7rem; background: #b91c1c; color: #fff; padding: 2px 8px; font-weight: bold; text-transform: uppercase;">${article.category}</span>
            <h2 style="font-family: Georgia, serif; font-size: 1.8rem; margin: 12px 0 8px 0; color: #0f172a;">${article.title}</h2>
            <span style="font-size: 0.8rem; color: #64748b;">Published ${article.time}</span>
            <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;">
            <p style="font-size: 1.05rem; line-height: 1.6; color: #334155;">${article.excerpt} Full investigative coverage and regional updates continue to unfold as local authorities and stakeholders assess the long-term impact on community growth and infrastructure development.</p>

            <h3 style="margin-top: 35px; border-bottom: 2px solid #0f172a; padding-bottom: 6px; font-size: 1.1rem;">Reader Comments ${req.session.isAdmin ? '<span style="font-size:0.75rem; color:#b91c1c; font-weight:bold; float:right;">Admin Mode Active</span>' : ''}</h3>
            <div style="margin-bottom: 20px;">${commentList}</div>

            <form action="/article/${article.id}/comment" method="POST" style="background: #f8fafc; padding: 20px; border: 1px solid #cbd5e1; border-radius: 4px;">
                <h4 style="margin: 0 0 10px 0; font-size: 0.95rem; color: #0f172a;">Leave a Comment</h4>
                <input type="text" name="name" placeholder="Your Name" required style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 3px;"><br>
                <textarea name="text" placeholder="What are your thoughts?" required style="width: 100%; padding: 8px; margin-bottom: 10px; height: 60px; border: 1px solid #cbd5e1; border-radius: 3px;"></textarea><br>
                <button type="submit" style="background: #b91c1c; color: #fff; border: none; padding: 8px 16px; font-weight: bold; border-radius: 3px; cursor: pointer;">Post Comment</button>
            </form>
        </div>
    </div>
    <footer>&copy; 2026 Hopekoncept News Service. All rights reserved.</footer>
</body>
</html>
    `);
});

app.post("/article/:id/comment", (req, res) => {
    const article = articles.find(a => a.id == req.params.id);
    if (article) {
        const { name, text } = req.body;
        article.comments.push({ id: commentIdCounter++, name, text });
    }
    res.redirect("/article/" + req.params.id);
});

app.post("/article/:articleId/comment/:commentId/delete", (req, res) => {
    if (!req.session.isAdmin) return res.status(403).send("Unauthorized");
    const article = articles.find(a => a.id == req.params.articleId);
    if (article) {
        article.comments = article.comments.filter(c => c.id != req.params.commentId);
    }
    res.redirect("/article/" + req.params.articleId);
});

app.get("/admin", (req, res) => {
    if (!req.session.isAdmin) {
        return res.send(`
            <!DOCTYPE html><html><head><title>Admin Login</title></head>
            <body style="font-family:Arial; background:#f1f5f9; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
                <div style="background:#fff; padding:30px; border-radius:4px; width:300px; box-shadow:0 4px 6px rgba(0,0,0,0.1); border-top: 4px solid #b91c1c;">
                    <h2 style="color:#0f172a; font-size:1.2rem; margin-top:0;">Editorial Login</h2>
                    ${req.query.error ? '<p style="color:#b91c1c; font-size:0.85rem;">Invalid Credentials</p>' : ''}
                    <form action="/admin/login" method="POST">
                        <input type="password" name="password" placeholder="Password" required style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:3px;">
                        <button type="submit" style="width:100%; padding:10px; background:#b91c1c; color:#fff; border:none; font-weight:bold; border-radius:3px; cursor:pointer;">Sign In</button>
                    </form>
                </div>
            </body></html>
        `);
    }

    let categoryOptions = categories.map(c => `<option value="${c}">${c}</option>`).join("");

    res.send(`
        <!DOCTYPE html><html><head><title>Editorial Dashboard</title></head>
        <body style="font-family:Arial; background:#f1f5f9; padding:20px;">
            <div style="max-width:500px; margin:30px auto; background:#fff; padding:30px; border-radius:4px; box-shadow:0 4px 6px rgba(0,0,0,0.1); border-top: 4px solid #b91c1c;">
                <h2 style="color:#0f172a; margin-top:0;">Publish News Article</h2>
                <form action="/admin/publish" method="POST">
                    <input type="text" name="title" placeholder="Headline Title" required style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:3px;"><br>
                    <select name="category" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:3px;">
                        ${categoryOptions}
                    </select><br>
                    <textarea name="excerpt" placeholder="Story summary..." required style="width:100%; padding:10px; margin-bottom:12px; height:80px; border:1px solid #cbd5e1; border-radius:3px;"></textarea><br>
                    <button type="submit" style="background:#b91c1c; color:#fff; padding:10px 20px; border:none; border-radius:3px; font-weight:bold; cursor:pointer;">Publish Story</button>
                </form>
                <br><a href="/admin/logout" style="color:#b91c1c; text-decoration:none; font-size:0.85rem;">Logout</a> | <a href="/" style="color:#0f172a; text-decoration:none; font-size:0.85rem;">View Site</a>
            </div>
        </body></html>
    `);
});

app.post("/admin/login", (req, res) => {
    if (req.body.password === ADMIN_PASS) { req.session.isAdmin = true; res.redirect("/admin"); }
    else { res.redirect("/admin?error=true"); }
});

app.get("/admin/logout", (req, res) => { req.session.destroy(() => res.redirect("/admin")); });

app.post("/admin/publish", (req, res) => {
    if (!req.session.isAdmin) return res.status(403).send("Unauthorized");
    const { title, category, excerpt } = req.body;
    articles.unshift({ id: articles.length + 1, title, category, excerpt, time: "Just now", comments: [] });
    res.redirect("/");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
                          
