'use strict';
const { spawn } = require('node:child_process');
// Push committed source to the only production branch. No generated-site branch.
hexo.extend.deployer.register('production', function () {
  return new Promise(function (resolve, reject) {
    const child = spawn('git', ['push', 'origin', 'main'], { cwd: hexo.base_dir, stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', function (code) {
      if (code === 0) resolve();
      else reject(new Error('Production push failed: ' + code));
    });
  });
});
