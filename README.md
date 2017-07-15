sloth.js: Spitz 部屬工具 
=========================

sloth.js 是 Spitz 的部屬和更新工具，管理與批次執行系統更新程序。  
內建常用的更新部屬模組，可直接被引用執行；
亦可透過擴充 Script 來客製處理版本間的更新程序。

使用說明
--------

```bash
  Usage: sloth [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -p, --path <folder>    apply update jobs from <folder>
    -u, --update <a>..<b>  apply serial update jobs from <begin> to <end>
    -i, --init             apply init script after update
    -t, --target <name>    specify effect target, default: null

  Examples:

    $ ./sloth.js -p 160327 -t mirror
    $ node sloth.js -u 160327..160430 --init -t master
```


sloth.js 檔案結構
------------------

sloth.js 檔案結構如下
{% asciitree %}
config
-<TARGET>
--db.json (#1)
--...etc...
-db.json (#1)
-...etc...
lib
-builtin-module.js
-builtin-script.sh
-...etc...
update_<Number>
-config
--db.json (#1)
--...etc...
-<TARGET>
--config
---db.json (#1)
---...etc...
--data.txt
--...etc...
-00_js-script-here.js
-10_apply-sql.sql
-20_builtin-js-script.json
-30_builtin-shell-script.json
-40_bash-script-here.sh
update_<Number>
sloth.js
README.md
{% endasciitree %}

### 檔案結構說明 ###

1.  設定檔複寫資訊


支援格式
--------

### JSON (*.json) ###

### JavaScript (*.js) ###

### Bash Script (*.sh) ###

### SQL (*.sql) ###




內建模組
--------

### src_depoly ###



備註
----

### 參考資料 References ###

__Used Packages__
-   [commander](https://www.npmjs.com/package/commander)
-   [inquirer](https://www.npmjs.com/package/inquirer)

__References__
-   [Command-line utilities with Node.js](http://goo.gl/9zPKct)
-   [Building command line tools with Node.js - Atlassian Developers](https://goo.gl/mSJCrC)
-   [Node.js for Command-line Developers | Chegg Engineering](http://goo.gl/Clf9nI)
-   [Creating Node.js Command Line Utilities to Improve Your Workflow -Telerik Developer Network](http://goo.gl/AKtVY1)
