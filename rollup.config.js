import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss';
import copy from 'rollup-plugin-copy';
import pug from 'rollup-plugin-pug';
import pugCompiler from 'pug';
import { globSync } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const production = !process.env.ROLLUP_WATCH;

export default [
  // 主要JS引擎打包配置
  {
    input: 'src/engine.js',
    output: [
      {
        file: 'engine.js',
        format: 'iife',
        name: 'Engine',
        sourcemap: !production
      },
      production && {
        file: 'engine-min.js',
        format: 'iife',
        name: 'Engine',
        plugins: [terser()]
      }
    ].filter(Boolean),
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      // 开发服务器和热重载
      !production && serve({
        open: true,
        contentBase: '.',
        host: '0.0.0.0',
        port: 10001
      }),
      !production && livereload()
    ].filter(Boolean)
  },
  // 处理SCSS和Pug文件
  {
    input: 'docs/index.js',
    output: {
      file: 'docs/bundle.js',
      format: 'iife'
    },
    plugins: [
      // 处理SCSS
      scss({
        output: 'docs/index.css',
        watch: 'docs'
      }),
      // 处理pug文件
      copy({
        targets: [
          { 
            src: 'docs/index.pug', 
            dest: 'docs', 
            rename: () => 'index.html', 
            transform: (contents) => {
              // 使用绝对路径作为basedir
              const docsDir = path.resolve(__dirname, 'docs');
              
              try {
                return pugCompiler.compile(contents.toString(), {
                  pretty: true,
                  basedir: docsDir,
                  filename: path.resolve(docsDir, 'index.pug')
                })({testcases: {}});
              } catch (err) {
                console.error('编译index.pug时出错:', err);
                throw err;
              }
            }
          },
          { 
            src: 'docs/test.pug', 
            dest: 'docs', 
            rename: () => 'test.html', 
            transform: (contents) => {
              // 使用绝对路径作为basedir
              const docsDir = path.resolve(__dirname, 'docs');
              
              try {
                // 收集测试用例信息
                const testcases = {};
                const files = globSync('test/**/*.js');
                files.forEach((f) => {
                  const arr = f.split('/');
                  if (testcases[arr[1]]) {
                    testcases[arr[1]].push({ path: f, name: arr[2] });
                  } else {
                    testcases[arr[1]] = [{ path: f, name: arr[2] }];
                  }
                });
                
                return pugCompiler.compile(contents.toString(), {
                  pretty: true,
                  basedir: docsDir,
                  filename: path.resolve(docsDir, 'test.pug')
                })({testcases: testcases});
              } catch (err) {
                console.error('编译test.pug时出错:', err);
                throw err;
              }
            }
          }
        ]
      })
    ]
  }
]; 