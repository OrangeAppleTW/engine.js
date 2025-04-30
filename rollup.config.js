import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss';
import copy from 'rollup-plugin-copy';
import pugCompiler from 'pug';
import { globSync } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const production = !process.env.ROLLUP_WATCH;

// 读取 camelCase 到 snake_case 的映射
const camelToSnakeMapping = JSON.parse(fs.readFileSync('camel-to-snake-mapping.json', 'utf-8'));

// 自定义插件：将驼峰命名转换为蛇形命名
function camelToSnakePlugin(mapping) {
  return {
    name: 'camel-to-snake',
    renderChunk(code, chunk) {
      // 只針對 snake_case 的 chunk 進行處理
      if (!chunk.fileName.includes('engine-snake')) {
        return null;
      }

      console.log(`[camelToSnakePlugin] Processing chunk: ${chunk.fileName}`);
      let transformedCode = code;
      let replacementOccurred = false;

      for (const camel in mapping) {
        if (Object.hasOwnProperty.call(mapping, camel)) {
          const snake = mapping[camel];
          // !!! 警告：移除 \b 以進行除錯，可能導致錯誤替換 !!!
          // const regex = new RegExp(`\b${camel}\b`, 'g'); 
          const searchString = camel; // 直接使用字串
          
          // 檢查字串是否存在
          if (transformedCode.includes(searchString)) {
            console.log(`[camelToSnakePlugin] Found match for: ${camel}, replacing with: ${snake}`);
            // 使用 split/join 進行全域替換 (比 replaceAll 兼容性稍好)
            transformedCode = transformedCode.split(searchString).join(snake);
            replacementOccurred = true;
          } else {
            // 可選：如果想看到哪些 key 沒有匹配，可以取消註解下一行
            // console.log(`[camelToSnakePlugin] No match found for: ${camel}`);
          }
        }
      }
      
      if (!replacementOccurred) {
           console.log('[camelToSnakePlugin] No replacements were made in this chunk.');
      }

      // 為了除錯，暫時輸出轉換後的程式碼片段
      // console.log('\n--- Transformed Code Snippet ---\n', transformedCode.substring(0, 500), '\n---\n');

      return { code: transformedCode, map: null };
    }
  };
}

export default [
  // 主要JS引擎打包配置 (CamelCase)
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
  // 主要JS引擎打包配置 (Snake_Case)
  // 
  // {
  //   input: 'src/engine.js',
  //   output: [
  //     {
  //       file: 'engine-snake.js', // Snake_case 文件名
  //       format: 'iife',
  //       name: 'Engine',
  //       sourcemap: !production
  //     }
  //   ].filter(Boolean),
  //   plugins: [
  //     resolve({
  //       browser: true
  //     }),
  //     commonjs(),
  //     camelToSnakePlugin(camelToSnakeMapping), // 应用转换插件
  //     // 开发服务器和热重载通常只用于主开发版本，这里省略
  //   ].filter(Boolean)
  // },
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