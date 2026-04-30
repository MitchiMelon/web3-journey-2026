const forumLatest = 'https://cdn.freecodecamp.org/curriculum/forum-latest/latest.json';
const forumTopicUrl = 'https://forum.freecodecamp.org/t/';
const forumCategoryUrl = 'https://forum.freecodecamp.org/c/';
const avatarUrl = 'https://cdn.freecodecamp.org/curriculum/forum-latest';


const allCategories = {
  299: { category: 'Career Advice', className: 'career' },
  409: { category: 'Project Feedback', className: 'feedback' },
  417: { category: 'freeCodeCamp Support', className: 'support' },
  421: { category: 'JavaScript', className: 'javascript' },
  423: { category: 'HTML - CSS', className: 'html-css' },
  424: { category: 'Python', className: 'python' },
  432: { category: 'You Can Do This!', className: 'motivation' },
  560: { category: 'Back-End Development', className: 'backend' }
};


function timeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));


  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${diffDays}d ago`;
}


function viewCount(views) {
  return views >= 1000 ? `${Math.floor(views / 1000)}k` : views;
}


function forumCategory(id) {
  const cat = allCategories[id] || { category: 'General', className: 'general' };
  return `<a class="category ${cat.className}" href="${forumCategoryUrl}${cat.className}/${id}">${cat.category}</a>`;
}


function avatars(posters, users) {
  return posters.map(poster => {
    const user = users.find(u => u.id === poster.user_id);
    if (!user) return '';
    const template = user.avatar_template.replace('{size}', '30');
    const imgUrl = template.startsWith('http')
      ? template
      : `${avatarUrl}/${template.replace(/^\//, '')}`;
    return `<img src="${imgUrl}" alt="${user.name}">`;
  }).join('');
}


function showLatestPosts(data) {
  const { users, topic_list } = data;
  const topics = topic_list.topics;


  document.getElementById('posts-container').innerHTML = topics.map(topic => {
    const { id, title, views, posts_count, slug, posters, category_id, bumped_at } = topic;
    return `
    <tr>
      <td>
        <a class="post-title" href="${forumTopicUrl}${slug}/${id}">${title}</a>
        ${forumCategory(category_id)}
      </td>
      <td><div class="avatar-container">${avatars(posters, users)}</div></td>
      <td>${posts_count - 1}</td>
      <td>${viewCount(views)}</td>
      <td>${timeAgo(bumped_at)}</td>
    </tr>`;
  }).join('');
}


async function fetchData() {
  try {
    const res = await fetch(forumLatest);
    const data = await res.json();
    showLatestPosts(data);
  } catch (err) {
    console.log(err);
  }
}


fetchData();