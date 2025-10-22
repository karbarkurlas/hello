User.destroy_all
Category.destroy_all
Post.destroy_all
Comment.destroy_all
Like.destroy_all

u1 = User.create!(name: "Alice", email: "alice@example.com")
u2 = User.create!(name: "Bob",   email: "bob@example.com")

c1 = Category.create!(name: "General")
c2 = Category.create!(name: "Rails")

p1 = Post.create!(user: u1, category: c2, title: "Hello Rails",  body: "First post body.")
p2 = Post.create!(user: u2, category: c1, title: "API-only app", body: "Just JSON here.")

Comment.create!(user: u2, post: p1, body: "Nice post!")
Comment.create!(user: u1, post: p1, body: "Thanks!")

Like.create!(user: u1, post: p2)
Like.create!(user: u2, post: p1)