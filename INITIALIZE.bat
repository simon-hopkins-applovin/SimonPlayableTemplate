@ECHO OFF
ECHO hello world
ECHO removing all files from work tree (github will still include these in the repo but not track them)
forfiles /P "WebContent" /M "*.*" /S /C "cmd /c git update-index --skip-worktree @file"
ECHO adding Util.js
git update-index --no-skip-worktree WebContent\js\Util.js
ECHO adding MiscObjects.js
git update-index --no-skip-worktree WebContent\js\MiscObjects.js
ECHO adding phaser_simon.js
git update-index --no-skip-worktree WebContent\lib\phaser_simon.js
ECHO adding PhaserHelperClasses
forfiles /P "WebContent\assets\PhaserHelperClasses" /M "*.*" /S /C "cmd /c git update-index --no-skip-worktree @file"
git update-index --no-skip-worktree .gitignore

git ls-files -t
