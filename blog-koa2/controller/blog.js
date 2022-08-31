// 通过 xss 工具 防止xss攻击
// 通过注入恶意代码块发起攻击
// 主要通过后端 对敏感数据进行转义
const xss = require("xss");
const { exec, escape } = require("../db/mysql");

const getList = async (author, keyword) => {
  let sql = `SELECT * from blogs  where 1=1 `;
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += `order by createtime desc`;
  return await exec(sql);
};

const getDetail = async (id) => {
  const sql = `select * from blogs where id=${id}`;
  const row = await exec(sql);
  return row[0];
  // return await exec(sql).then((rows) => rows[0]);
};

const createBlog = async (blogData = {}) => {
  // blogData 为博客对象
  const title = xss(escape(blogData.title));
  const content = xss(escape(blogData.content));
  const author = xss(escape(blogData.author));
  const createtime = Date.now();

  const sql = `insert into blogs (title, content, createtime, author) value (${title}, ${content}, '${createtime}', ${author})`;
  const insertData = await exec(sql);
  return { id: insertData.insertId };
  /*   return await exec(sql).then((insertData) => {
    console.log(insertData);
    return { id: insertData.insertId };
  }); */
};

const updateBlog = async (id, blogData = {}) => {
  // blogData 为博客对象
  const title = blogData.title;
  const content = blogData.content;
  const createtime = Date.now();
  const sql = `update blogs set title='${title}', content='${content}', createtime='${createtime}' where id='${id}' `;
  const updateData = await exec(sql);
  if (updateData.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
  /*   return exec(sql).then((updateData) => {
    if (updateData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  }); */
};

const deleteBlog = async (id, author) => {
  // blogData 为博客对象
  const sql = `delete from blogs where id='${id}' and author='${author}'`;
  const deleteData = await exec(sql);
  return deleteData.affectedRows > 0 ? true : false;
  /*   return exec(sql).then((deleteData) => {
    return deleteData.affectedRows > 0 ? true : false;
  }); */
};

module.exports = {
  getList,
  getDetail,
  createBlog,
  updateBlog,
  deleteBlog,
};
