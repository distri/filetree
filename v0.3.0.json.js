window["STRd6/filetree:v0.3.0"]({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "mode": "100644",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "mode": "100644",
      "content": "filetree\n========\n\nA simple filetree\n",
      "type": "blob"
    },
    "demo.coffee.md": {
      "path": "demo.coffee.md",
      "mode": "100644",
      "content": "A demo application displaying the filetree.\n\n    File = require \"./file\"\n    Filetree = require \"./filetree\"\n\n    template = require(\"./templates/filetree\")\n\n    demoData = [\n      {\n        path: \"hey.yolo\"\n        content: \"wat\"\n        type: \"blob\"\n      }\n    ]\n\n    filetree = Filetree()\n    filetree.load demoData\n\n    filetree.selectedFile.observe (file) ->\n      console.log file\n\n    $('body').append template(filetree)\n",
      "type": "blob"
    },
    "file.coffee.md": {
      "path": "file.coffee.md",
      "mode": "100644",
      "content": "File Model\n==========\n\nThe `File` model represents a file in a file system. It is populated by data\nreturned from the Github API.\n\n    File = (I={}) ->\n      Object.defaults I,\n        content: \"\"\n\n      throw \"File must have a path\" unless I.path\n\n      self = Model(I).observeAll()\n\n      self.extend\n\nThe extension is the last part of the filename after the `.`, for example\n`\"coffee\"` for a file named `\"main.coffee\"` or `\"haml\"` for a file named\n`\"filetree.haml\"`.\n\n        extension: ->\n          self.path().extension()\n\nThe `mode` of the file is what editor mode to use for our text editor.\n\n        mode: ->\n          switch extension = self.extension()\n            when \"js\"\n              \"javascript\"\n            when \"md\" # TODO: See about nested markdown code modes for .haml.md, .js.md, and .coffee.md\n              \"markdown\"\n            when \"cson\"\n              \"coffee\"\n            when \"\"\n              \"text\"\n            else\n              extension\n\nModified tracks whether the file has been changed since it was created.\n\n        modified: Observable(false)\n\nThe `displayName` is how the file appears in views.\n\n        displayName: Observable(self.path())\n\nWhen our content changes we assume we are modified. In the future we may want to\ntrack the original content and compare with that to get a more accurate modified\nstatus.\n\n      self.content.observe ->\n        self.modified(true)\n\nWhen our modified state changes we adjust the `displayName` to provide a visual\nindication.\n\n      self.modified.observe (modified) ->\n        if modified\n          self.displayName(\"*#{self.path()}\")\n        else\n          self.displayName(self.path())\n\n      return self\n\nExport\n\n    module.exports = File\n",
      "type": "blob"
    },
    "filetree.coffee.md": {
      "path": "filetree.coffee.md",
      "mode": "100644",
      "content": "Filetree Model\n==============\n\n    File = require(\"./file\")\n\nThe `Filetree` model represents a tree of files.\n\n    Filetree = (I={}) ->\n      Object.defaults I,\n        files: []\n\n      self = Model(I).observeAll()\n\nThe `selectedFile` observable keeps people up to date on what file has been\nselected.\n\n      self.attrObservable \"selectedFile\"\n\n      self.extend\n\nLoad files either from an array of file data objects or from an object with\npaths as keys and file data objects as values.\n\nThe files are sorted by name after loading.\n\nTODO: Always maintain the files in a sorted list using some kind of sorted\nobservable.\n\n        load: (fileData) ->\n          if Array.isArray(fileData)\n            files = fileData.sort (a, b) ->\n              if a.path < b.path\n                -1\n              else if b.path < a.path\n                1\n              else\n                0\n            .map File\n\n          else\n            files = Object.keys(fileData).sort().map (path) ->\n              File fileData[path]\n\n          self.files(files)\n\nThe `data` method returns an array of file data objects that is compatible with\nthe github tree api.\n\nThe objects have a `path`, `content`, `type`, and `mode`.\n\n        data: ->\n          self.files.map (file) ->\n            path: file.path()\n            mode: \"100644\"\n            content: file.content()\n            type: \"blob\"\n\nThe filetree `hasUnsavedChanges` if any file in the tree is modified.\n\n        hasUnsavedChanges: ->\n          self.files().select (file) ->\n            file.modified()\n          .length\n\nMarking the filetree as saved resets the modification status of each file.\n\nTODO: There can be race conditions since the save is async.\n\nTODO: Use git trees and content shas to robustly manage changed state.\n\n        markSaved: ->\n          self.files().each (file) ->\n            file.modified(false)\n\n      return self\n\nExport\n\n    module.exports = Filetree\n",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "mode": "100644",
      "content": "Filetree\n========\n\nAn interactive HTML filetree that presents file data in the style of Github API\nrequests.\n\n    module.exports =\n      File: require \"./file\"\n      Filetree: require \"./filetree\"\n      template: require \"./templates/filetree\"\n\n    # TODO: Check if package is root package and then run demo\n    # require \"./demo\"\n",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "mode": "100644",
      "content": "version: \"0.3.0\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n  \"//cdnjs.cloudflare.com/ajax/libs/coffee-script/1.6.3/coffee-script.min.js\"\n  \"http://strd6.github.io/tempest/javascripts/envweb.js\"\n]\n",
      "type": "blob"
    },
    "templates/filetree.haml.md": {
      "path": "templates/filetree.haml.md",
      "mode": "100644",
      "content": "Render a list of files as a filetree.\n\n    %ul.filetree\n      - selectedFile = @selectedFile\n      - files = @files\n      - each files, (file) ->\n        %li= file.displayName\n          - on \"click\", (e) ->\n            - selectedFile(file) if $(e.target).is('li')\n          .delete\n            - on \"click\", -> files.remove(file) if confirm(\"Delete #{file.path()}?\")\n            X\n",
      "type": "blob"
    },
    "test/filetree.coffee": {
      "path": "test/filetree.coffee",
      "mode": "100644",
      "content": "{File, Filetree, template} = require \"../main\"\n\ndescribe \"Filetree\", ->\n  it \"should expose a template\", ->\n    assert template\n\n  it \"should expose a Filetree constructor\", ->\n    assert Filetree\n\n  it \"should expose a File constructor\", ->\n    assert File\n      path: \"duder.txt\"\n",
      "type": "blob"
    }
  },
  "distribution": {
    "demo": {
      "path": "demo",
      "content": "(function() {\n  var File, Filetree, demoData, filetree, template;\n\n  File = require(\"./file\");\n\n  Filetree = require(\"./filetree\");\n\n  template = require(\"./templates/filetree\");\n\n  demoData = [\n    {\n      path: \"hey.yolo\",\n      content: \"wat\",\n      type: \"blob\"\n    }\n  ];\n\n  filetree = Filetree();\n\n  filetree.load(demoData);\n\n  filetree.selectedFile.observe(function(file) {\n    return console.log(file);\n  });\n\n  $('body').append(template(filetree));\n\n}).call(this);\n\n//# sourceURL=demo.coffee",
      "type": "blob"
    },
    "file": {
      "path": "file",
      "content": "(function() {\n  var File;\n\n  File = function(I) {\n    var self;\n    if (I == null) {\n      I = {};\n    }\n    Object.defaults(I, {\n      content: \"\"\n    });\n    if (!I.path) {\n      throw \"File must have a path\";\n    }\n    self = Model(I).observeAll();\n    self.extend({\n      extension: function() {\n        return self.path().extension();\n      },\n      mode: function() {\n        var extension;\n        switch (extension = self.extension()) {\n          case \"js\":\n            return \"javascript\";\n          case \"md\":\n            return \"markdown\";\n          case \"cson\":\n            return \"coffee\";\n          case \"\":\n            return \"text\";\n          default:\n            return extension;\n        }\n      },\n      modified: Observable(false),\n      displayName: Observable(self.path())\n    });\n    self.content.observe(function() {\n      return self.modified(true);\n    });\n    self.modified.observe(function(modified) {\n      if (modified) {\n        return self.displayName(\"*\" + (self.path()));\n      } else {\n        return self.displayName(self.path());\n      }\n    });\n    return self;\n  };\n\n  module.exports = File;\n\n}).call(this);\n\n//# sourceURL=file.coffee",
      "type": "blob"
    },
    "filetree": {
      "path": "filetree",
      "content": "(function() {\n  var File, Filetree;\n\n  File = require(\"./file\");\n\n  Filetree = function(I) {\n    var self;\n    if (I == null) {\n      I = {};\n    }\n    Object.defaults(I, {\n      files: []\n    });\n    self = Model(I).observeAll();\n    self.attrObservable(\"selectedFile\");\n    self.extend({\n      load: function(fileData) {\n        var files;\n        if (Array.isArray(fileData)) {\n          files = fileData.sort(function(a, b) {\n            if (a.path < b.path) {\n              return -1;\n            } else if (b.path < a.path) {\n              return 1;\n            } else {\n              return 0;\n            }\n          }).map(File);\n        } else {\n          files = Object.keys(fileData).sort().map(function(path) {\n            return File(fileData[path]);\n          });\n        }\n        return self.files(files);\n      },\n      data: function() {\n        return self.files.map(function(file) {\n          return {\n            path: file.path(),\n            mode: \"100644\",\n            content: file.content(),\n            type: \"blob\"\n          };\n        });\n      },\n      hasUnsavedChanges: function() {\n        return self.files().select(function(file) {\n          return file.modified();\n        }).length;\n      },\n      markSaved: function() {\n        return self.files().each(function(file) {\n          return file.modified(false);\n        });\n      }\n    });\n    return self;\n  };\n\n  module.exports = Filetree;\n\n}).call(this);\n\n//# sourceURL=filetree.coffee",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  module.exports = {\n    File: require(\"./file\"),\n    Filetree: require(\"./filetree\"),\n    template: require(\"./templates/filetree\")\n  };\n\n}).call(this);\n\n//# sourceURL=main.coffee",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.3.0\",\"remoteDependencies\":[\"//code.jquery.com/jquery-1.10.1.min.js\",\"//cdnjs.cloudflare.com/ajax/libs/coffee-script/1.6.3/coffee-script.min.js\",\"http://strd6.github.io/tempest/javascripts/envweb.js\"]};",
      "type": "blob"
    },
    "templates/filetree": {
      "path": "templates/filetree",
      "content": "module.exports = Function(\"return \" + HAMLjr.compile(\"\\n\\n%ul.filetree\\n  - selectedFile = @selectedFile\\n  - files = @files\\n  - each files, (file) ->\\n    %li= file.displayName\\n      - on \\\"click\\\", (e) ->\\n        - selectedFile(file) if $(e.target).is('li')\\n      .delete\\n        - on \\\"click\\\", -> files.remove(file) if confirm(\\\"Delete #{file.path()}?\\\")\\n        X\\n\", {compiler: CoffeeScript}))()",
      "type": "blob"
    },
    "test/filetree": {
      "path": "test/filetree",
      "content": "(function() {\n  var File, Filetree, template, _ref;\n\n  _ref = require(\"../main\"), File = _ref.File, Filetree = _ref.Filetree, template = _ref.template;\n\n  describe(\"Filetree\", function() {\n    it(\"should expose a template\", function() {\n      return assert(template);\n    });\n    it(\"should expose a Filetree constructor\", function() {\n      return assert(Filetree);\n    });\n    return it(\"should expose a File constructor\", function() {\n      return assert(File({\n        path: \"duder.txt\"\n      }));\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/filetree.coffee",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://strd6.github.io/editor/"
  },
  "version": "0.3.0",
  "entryPoint": "main",
  "remoteDependencies": [
    "//code.jquery.com/jquery-1.10.1.min.js",
    "//cdnjs.cloudflare.com/ajax/libs/coffee-script/1.6.3/coffee-script.min.js",
    "http://strd6.github.io/tempest/javascripts/envweb.js"
  ],
  "repository": {
    "id": 13128952,
    "name": "filetree",
    "full_name": "STRd6/filetree",
    "owner": {
      "login": "STRd6",
      "id": 18894,
      "avatar_url": "https://1.gravatar.com/avatar/33117162fff8a9cf50544a604f60c045?d=https%3A%2F%2Fidenticons.github.com%2F39df222bffe39629d904e4883eabc654.png&r=x",
      "gravatar_id": "33117162fff8a9cf50544a604f60c045",
      "url": "https://api.github.com/users/STRd6",
      "html_url": "https://github.com/STRd6",
      "followers_url": "https://api.github.com/users/STRd6/followers",
      "following_url": "https://api.github.com/users/STRd6/following{/other_user}",
      "gists_url": "https://api.github.com/users/STRd6/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/STRd6/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/STRd6/subscriptions",
      "organizations_url": "https://api.github.com/users/STRd6/orgs",
      "repos_url": "https://api.github.com/users/STRd6/repos",
      "events_url": "https://api.github.com/users/STRd6/events{/privacy}",
      "received_events_url": "https://api.github.com/users/STRd6/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/STRd6/filetree",
    "description": "A simple filetree",
    "fork": false,
    "url": "https://api.github.com/repos/STRd6/filetree",
    "forks_url": "https://api.github.com/repos/STRd6/filetree/forks",
    "keys_url": "https://api.github.com/repos/STRd6/filetree/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/STRd6/filetree/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/STRd6/filetree/teams",
    "hooks_url": "https://api.github.com/repos/STRd6/filetree/hooks",
    "issue_events_url": "https://api.github.com/repos/STRd6/filetree/issues/events{/number}",
    "events_url": "https://api.github.com/repos/STRd6/filetree/events",
    "assignees_url": "https://api.github.com/repos/STRd6/filetree/assignees{/user}",
    "branches_url": "https://api.github.com/repos/STRd6/filetree/branches{/branch}",
    "tags_url": "https://api.github.com/repos/STRd6/filetree/tags",
    "blobs_url": "https://api.github.com/repos/STRd6/filetree/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/STRd6/filetree/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/STRd6/filetree/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/STRd6/filetree/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/STRd6/filetree/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/STRd6/filetree/languages",
    "stargazers_url": "https://api.github.com/repos/STRd6/filetree/stargazers",
    "contributors_url": "https://api.github.com/repos/STRd6/filetree/contributors",
    "subscribers_url": "https://api.github.com/repos/STRd6/filetree/subscribers",
    "subscription_url": "https://api.github.com/repos/STRd6/filetree/subscription",
    "commits_url": "https://api.github.com/repos/STRd6/filetree/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/STRd6/filetree/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/STRd6/filetree/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/STRd6/filetree/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/STRd6/filetree/contents/{+path}",
    "compare_url": "https://api.github.com/repos/STRd6/filetree/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/STRd6/filetree/merges",
    "archive_url": "https://api.github.com/repos/STRd6/filetree/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/STRd6/filetree/downloads",
    "issues_url": "https://api.github.com/repos/STRd6/filetree/issues{/number}",
    "pulls_url": "https://api.github.com/repos/STRd6/filetree/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/STRd6/filetree/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/STRd6/filetree/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/STRd6/filetree/labels{/name}",
    "releases_url": "https://api.github.com/repos/STRd6/filetree/releases{/id}",
    "created_at": "2013-09-26T17:13:32Z",
    "updated_at": "2013-11-03T19:42:48Z",
    "pushed_at": "2013-11-03T19:42:47Z",
    "git_url": "git://github.com/STRd6/filetree.git",
    "ssh_url": "git@github.com:STRd6/filetree.git",
    "clone_url": "https://github.com/STRd6/filetree.git",
    "svn_url": "https://github.com/STRd6/filetree",
    "homepage": null,
    "size": 1068,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "CoffeeScript",
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "master_branch": "master",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "network_count": 0,
    "subscribers_count": 1,
    "branch": "v0.3.0",
    "defaultBranch": "master"
  },
  "dependencies": {}
});