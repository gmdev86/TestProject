//how to run
SET DEBUG=testproject:* & npm start

ctrl + k and ctrl + c  //comment line
ctrl + k and ctrl + u // uncomment lines

<div class="list-group">
  <!-- loop over blog posts and render them -->
  <% posts.forEach((post) => { %>
    <a href="/post/<%= post.id %>" class="list-group-item">
      <h4 class="list-group-item-heading"><%= post.title %></h4>
      <p class="list-group-item-text"><%= post.author %></p>
    </a>
  <% }) %>
</div>