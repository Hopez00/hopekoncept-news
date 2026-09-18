const express = require('express');
const session = require('express-session');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const upload = multer({ storage: multer.memoryStorage() });

const supabaseUrl = 'https://lapfotycncf trdspyram.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcGZvdHljbmNmdHJkc3lyYW0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMDQ1NjM3NCwiZXhwIjoyMDQ2MDMyMzc0fQ.Q_z9LXVp0E_G7qQWXw7aK3aB7QvZqK_w7w8v7Q7v7Q7';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.use(session({
    secret: 'hopekoncept-secret',
    resave: false,
    saveUninitialized: false
}));

const ADMIN_PASS = 'Hope2026';
const categories = ['Education', 'Local News', 'Technology', 'Science', 'Sports', 'Politics', 'Entertainment'];
const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/020V8TRV6DeqDSKdX29';

app.get('/', async (req, res) => {
    const category = req.query.category || 'All';
    const search = req.query.search || '';

    let query = supabase.from('articles').select('*').order('id', { ascending: false });
    if (category !== 'All') {
        query = query.eq('category', category);
    }

    const { data: articles, error } = await query;
    const dbArticles = articles || [];

    const filtered = dbArticles.filter(a => {
        if (search) {
            return a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
        }
        return true;
    });

    let htmlCards = '';
    for (const a of filtered) {
        htmlCards += '<article style="border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 15px;">' +
            '<img src="' + a.image_url + '" alt="' + a.title + '" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;">' +
            '<span style="font-size: 0.7rem; background: #f0f2f5; color: #0f172a; padding: 2px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">' + a.category + '</span>' +
            '<h2 style="margin: 8px 0 4px 0; font-size: 1.15rem; color: #0f172a; font-family: Georgia, serif;"><a href="/article/' + a.id + '" style="color: #0f172a; text-decoration: none;">' + a.title + '</a></h2>' +
            '<p style="margin: 0 0 8px 0; font-size: 0.9rem; color: #334155; line-height: 1.4;">' + a.excerpt + '</p>' +
            '<span style="font-size: 0.75rem; color: #64748b;">Published ' + a.time + '</span>' +
            '<div style="margin-top: 8px;"><a href="/article/' + a.id + '" style="color: #0f6fcf; font-weight: bold; text-decoration: none;">Read More &rarr;</a></div>' +
            '</article>';
    }

    let navLinks = '<a href="/?category=All" style="color: #334155; font-weight: bold; padding: 4px 8px; border-radius: 4px; text-decoration: none; ' + (category === 'All' ? 'background: #0f6fcf; color: #fff;' : '') + '">All</a>';
    for (const c of categories) {
        navLinks += ' <a href="/?category=' + encodeURIComponent(c) + '" style="color: #334155; font-weight: bold; padding: 4px 8px; border-radius: 4px; text-decoration: none; ' + (category === c ? 'background: #0f6fcf; color: #fff;' : '') + '">' + c + '</a>';
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>HOPEKONCEPT NEWS - Global & Local Feed</title>
            <script src="https://quge58.com/tag.min.js" data-zone="282479" async data-cfasync="false"></script>
            <style>
                body { font-family: Helvetica, Arial, sans-serif; margin: 0; background: #f1f5f9; color: #0f172a; position: relative; }
                .bg-video-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: -1; }
                .bg-video-container video { width: 100%; height: 100%; object-fit: cover; }
                .bg-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.75); z-index: -1; }
                header { background: #000001; border-bottom: 4px solid #0f6fcf; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
                .ticker-bar { background: #0f6fcf; color: #fff; padding: 8px 20px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; }
                .nav-bar { background: rgba(255, 255, 255, 0.95); padding: 10px 20px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 10px; overflow-x: auto; }
                .search-container { background: rgba(15, 23, 42, 0.8); padding: 12px 20px; display: flex; justify-content: center; }
                .search-container form { display: flex; width: 100%; max-width: 800px; gap: 8px; }
                .search-container input { flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.9rem; }
                .search-container button { background: #0f6fcf; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; }
                .container { max-width: 800px; margin: 20px auto; padding: 0 15px; }
                .card { background: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 25px; margin-bottom: 20px; }
                footer { text-align: center; padding: 25px; color: #64748b; font-size: 0.8rem; margin-top: 40px; }
            </style>
        </head>
        <body>
            <div class="ticker-bar">
                <span>Breaking News Feed! Live Updates 24/7</span> | 
                <span>Live Clock: <span id="live-clock"></span></span> | 
                <a href="${WHATSAPP_CHANNEL_URL}" target="_blank" style="color: #fff; text-decoration: underline;">Join Our Official WhatsApp Channel</a>
            </div>
            <header>
                <div style="color: #fff; font-weight: bold; font-size: 1.2rem;">HOPEKONCEPT NEWS</div>
                <a href="/admin" style="color: #cbd5e1; font-size: 0.8rem; text-decoration: none; border: 1px solid #475569; padding: 4px 8px; border-radius: 4px;">Admin Portal</a>
            </header>
            <script>
                function updateClock() {
                    const now = new Date();
                    document.getElementById('live-clock').innerText = now.toLocaleTimeString();
                }
                setInterval(updateClock, 1000);
                updateClock();
            </script>
            <div class="search-container">
                <form action="/" method="GET">
                    <input type="text" name="search" placeholder="Search news headlines or topics..." value="${search}">
                    <button type="submit">Search</button>
                </form>
            </div>
            <div class="nav-bar">${navLinks}</div>
            <div class="container">
                <div class="card">
                    ${htmlCards.length > 0 ? htmlCards : '<p style="color: #64748b; text-align: center; padding: 20px;">No matching articles found.</p>'}
                </div>
            </div>
            <footer>&copy; 2026 Hopekoncept News Service. All rights reserved.</footer>
        </body>
        </html>
    `);
});

app.get('/article/:id', async (req, res) => {
    const articleId = req.params.id;
    const { data: articles } = await supabase.from('articles').select('*').eq('id', articleId);
    const article = articles ? articles[0] : null;

    if (!article) return res.status(404).send('Article not found');

    const { data: dbComments } = await supabase.from('comments').select('*').eq('article_id', articleId).order('id', { ascending: true });
    const comments = dbComments || [];

    const articleUrl = `https://${req.get('host')}/article/${article.id}`;
    const encodedTitle = encodeURIComponent(article.title);
    const encodedUrl = encodeURIComponent(articleUrl);

    let commentList = dbComments.length === 0 ? '<p style="color: #64748b; font-size: 0.85rem;">No comments yet. Be the first to comment!</p>' : comments.map(c => `
        <div style="background: #f8fafc; border-left: 3px solid #0f6fcf; padding: 10px 15px; margin-bottom: 10px; border-radius: 4px;">
            <p style="margin: 0 0 4px 0; font-size: 0.8rem; color: #334155;"><strong>${c.name}</strong></p>
            <p style="margin: 0; font-size: 0.9rem; color: #334155;">${c.text}</p>
            ${req.session && req.session.isAdmin ? `<form action="/article/${article.id}/comment/${c.id}/delete" method="POST" style="margin-top: 5px;"><button type="submit" style="background: none; border: none; color: #dc2626; font-size: 0.75rem; cursor: pointer; padding: 0;">Delete</button></form>` : ''}
        </div>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${article.title} - Hopekoncept News</title>
            <style>
                body { font-family: Helvetica, Arial, sans-serif; margin: 0; background: #f1f5f9; color: #0f172a; }
                header { background: #000001; border-bottom: 4px solid #0f6fcf; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
                .container { max-width: 800px; margin: 20px auto; padding: 0 15px; }
                .article-box { background: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                h1 { font-family: Georgia, serif; color: #0f172a; margin-top: 0; }
                .article-content h1, .article-content h2, .article-content h3 { margin-bottom: 15px; padding-left: 20px; color: #334155; }
                .share-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; margin: 25px 0; text-align: center; }
            </style>
        </head>
        <body>
            <header>
                <div style="color: #fff; font-weight: bold; font-size: 1.2rem;">HOPEKONCEPT NEWS</div>
                <a href="/" style="color: #cbd5e1; font-size: 0.8rem; text-decoration: none;">&larr; Back to Site</a>
            </header>
            <div class="container">
                <div class="article-box">
                    <img src="${article.image_url}" alt="${article.title}" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 6px; margin-bottom: 15px;">
                    <span style="font-size: 0.8rem; background: #0f6fcf; color: #fff; padding: 3px 10px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">${article.category}</span>
                    <h1>${article.title}</h1>
                    <span style="font-size: 0.8rem; color: #64748b;">Published ${article.time}</span>
                    <div class="article-content" style="margin-top: 20px; line-height: 1.6; color: #334155;">${article.content}</div>
                    
                    <div class="share-box">
                        <span style="font-size: 1.05rem; font-weight: bold; color: #0f172a;">Share this story:</span><br><br>
                        <a href="https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}" target="_blank" style="background: #25d366; color: #fff; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-right: 8px;">WhatsApp</a>
                        <a href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}" target="_blank" style="background: #1da1f2; color: #fff; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-right: 8px;">Twitter</a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" style="background: #1877f2; color: #fff; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold;">Facebook</a>
                    </div>

                    <h3 style="margin-top: 25px; border-bottom: 2px solid #0f6fcf; padding-bottom: 6px; font-size: 1.1rem;">Comments</h3>
                    <div style="margin-bottom: 20px;">${commentList}</div>

                    <form action="/article/${article.id}/comment" method="POST" style="background: #f8fafc; padding: 20px; border-radius: 6px;">
                        <h4 style="margin: 0 0 10px 0; font-size: 0.85rem; color: #0f172a;">Leave a Comment</h4>
                        <input type="text" name="name" placeholder="Your Name" required style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 4px;">
                        <textarea name="text" placeholder="What are your thoughts?" required style="width: 100%; padding: 8px; height: 80px; border: 1px solid #cbd5e1; border-radius: 4px;"></textarea>
                        <button type="submit" style="background: #0f6fcf; color: #fff; border: none; padding: 8px 20px; font-weight: bold; border-radius: 4px; cursor: pointer;">Post Comment</button>
                    </form>
                </div>
            </div>
            <footer>&copy; 2026 Hopekoncept News Service. All rights reserved.</footer>
        </body>
        </html>
    `);
});

app.post('/article/:id/comment', async (req, res) => {
    const articleId = req.params.id;
    const { name, text } = req.body;
    if (name && text) {
        await supabase.from('comments').insert([{ article_id: articleId, name, text }]);
    }
    res.redirect(`/article/${articleId}`);
});

app.post('/article/:articleId/comment/:commentId/delete', async (req, res) => {
    if (!req.session || !req.session.isAdmin) return res.status(403).send("Unauthorized");
    await supabase.from('comments').delete().eq('id', req.params.commentId);
    res.redirect(`/article/${req.params.articleId}`);
});

app.get('/admin', (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head><title>Admin Login</title></head>
            <body style="font-family: Arial; background: #f1f5f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
                <div style="background: #fff; padding: 30px; border-radius: 8px; width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h2 style="color: #0f172a; margin-top: 0;">Editorial Login</h2>
                    ${req.query.error ? '<p style="color: #dc2626; font-size: 0.85rem;">Session Expired or Invalid Credentials</p>' : ''}
                    <form action="/admin/login" method="POST">
                        <input type="password" name="password" placeholder="Password" required style="width: 100%; padding: 10px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 4px;">
                        <button type="submit" style="width: 100%; padding: 10px; background: #0f6fcf; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Login</button>
                    </form>
                </div>
            </body>
            </html>
        `);
    }

    const categoryOptions = categories.map(c => `<option value="${c}">${c}</option>`).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Editorial Dashboard</title>
            <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet">
        </head>
        <body style="font-family: Arial; background: #f1f5f9; padding: 20px;">
            <div style="max-width: 800px; margin: 20px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #0f172a; margin: 0;">Publish News Article</h2>
                    <a href="/" style="color: #0f6fcf; font-size: 0.9rem; text-decoration: none;">&larr; Back to Site</a>
                </div>
                <form id="publishForm" action="/admin/publish" method="POST" enctype="multipart/form-data">
                    <input type="text" name="title" placeholder="Headline Title" required style="width: 100%; padding: 10px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 4px;">
                    <select name="category" style="width: 100%; padding: 10px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 4px;">${categoryOptions}</select>
                    
                    <input type="file" name="media" id="media" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx" style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 4px;">
                    
                    <label style="font-size: 0.85rem; color: #475569; display: block; margin-bottom: 4px;">Article Body & Formatting Tools:</label>
                    <div id="editor" style="height: 300px; margin-bottom: 12px; background: #fff;"></div>
                    
                    <input type="hidden" name="content" id="content">
                    <input type="hidden" name="excerpt" id="excerpt">
                    
                    <button type="submit" style="background: #0f6fcf; color: #fff; border: none; padding: 10px 20px; font-weight: bold; border-radius: 4px; cursor: pointer;">Publish Now</button>
                </form>
                <p style="margin-top: 20px;"><a href="/admin/logout" style="color: #dc2626; text-decoration: none; font-size: 0.8rem;">Logout</a></p>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>
            <script>
                const quill = new Quill('#editor', {
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ color: [] }, { background: [] }],
                            [{ align: [] }],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['clean']
                        ]
                    }
                });

                document.getElementById('publishForm').onsubmit = function() {
                    const htmlContent = quill.root.innerHTML;
                    const textContent = quill.getText();
                    document.getElementById('content').value = htmlContent;
                    document.getElementById('excerpt').value = textContent.slice(0, 150) + '...';
                };
            </script>
        </body>
        </html>
    `);
});

app.post('/admin/login', (req, res) => {
    if (req.body.password === ADMIN_PASS) {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.redirect('/admin?error=true');
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/admin'));
});

app.post('/admin/publish', upload.array('media', 10), async (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.redirect('/admin?error=unauthorized');
    }

const { title, category, excerpt, content } = req.body;
    let mediaUrls = [];

    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const fileName = `${Date.now()}-${file.originalname}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('news-images')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (uploadError) {
                console.log("Supabase Storage Upload Error:", uploadError);
            } else {
                const { data: publicUrlData } = supabase.storage
                    .from('news-images')
                    .getPublicUrl(fileName);

                mediaUrls.push(publicUrlData.publicUrl);
            }
        }
    }

    if (title && category && content) {
        const { error: insertError } = await supabase.from('articles').insert([
            {
                title,
                category,
                excerpt: excerpt || content.replace(/(<([^>]+)>)/gi, '').slice(0, 150) + '...',
                content,
                image_url: mediaUrls.join(','),
                time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            }
        ]);

        if (insertError) {
            console.log("Supabase Insert Error:", insertError);
        }
    }

    res.redirect('/admin');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
