!function(e){var o={};function n(t){if(o[t])return o[t].exports;var i=o[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=o,n.d=function(e,o,t){n.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:t})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,o){if(1&o&&(e=n(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(n.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var i in e)n.d(t,i,function(o){return e[o]}.bind(null,i));return t},n.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(o,"a",o),o},n.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},n.p="",n(n.s=7)}([function(e,o){e.exports=require("lumi-cli/dist/api/API")},function(e,o){e.exports=require("lumi-cli/dist/lib/common/FS")},function(e,o){e.exports=require("lumi-cli/dist/api/routes/SocketEvents")},function(e,o){e.exports=require("electron")},function(e,o){e.exports=require("path")},function(e,o){e.exports=require("lumi-cli/dist/lib/common/types")},function(e,o){e.exports=require("lumi-cli/dist/lib/common/FileTree")},function(e,o,n){"use strict";n.r(o);var t,i=n(4),r=n.n(i);!function(e){e.TOP_BAR="/",e.HOME="/home",e.START="/start",e.LOADING="/loading",e.INVITE="/invite",e.SETTINGS="/settings",e.LEAVE="/leave",e.ROOM="/room",e.SERVER_LOG="/serverlog"}(t||(t={}));var c;!function(e){e.SELECT_DIR="select_dir",e.CREATE_ROOM="create_room",e.JOIN_ROOM="join_room",e.NAVIGATE="navigate",e.DISCONNECTED="disconnected",e.CHECK_CONNECTION="check_connection",e.FETCH_LOG="fetch_log",e.FETCH_FOLDER="fetch_folder",e.FETCH_USERS="fetch_users",e.CREATE_WINDOW="create_window",e.UPDATE_FOLDER="update_folder",e.UPDATE_USERS="update_users"}(c||(c={}));var s=c;const{Menu:l,MenuItem:a}=n(3);var d=n(0),u=n(1),p=n(2),f=n(5),h=n(6),v=function(e,o,n,t){return new(n||(n=Promise))((function(i,r){function c(e){try{l(t.next(e))}catch(e){r(e)}}function s(e){try{l(t.throw(e))}catch(e){r(e)}}function l(e){var o;e.done?i(e.value):(o=e.value,o instanceof n?o:new n((function(e){e(o)}))).then(c,s)}l((t=t.apply(e,o||[])).next())}))};const{ipcMain:m,dialog:E,BrowserWindow:_}=n(3);class R{static init(e){m.handle(s.CHECK_CONNECTION,()=>void 0!==R.connection&&R.connection.room),m.handle(s.SELECT_DIR,()=>v(this,void 0,void 0,(function*(){return(yield E.showOpenDialog(e,{properties:["openDirectory"]})).filePaths[0]}))),m.handle(s.CREATE_ROOM,(e,o)=>v(this,void 0,void 0,(function*(){const e=yield u.FS.zip(o);return(yield d.API.RoomRequest.create(e)).roomId}))),m.handle(s.JOIN_ROOM,(o,n,t)=>v(this,void 0,void 0,(function*(){console.log("JOINING ROOM"),console.log(n,t),void 0!==R.connection&&R.connection.socket.disconnect();const o=yield d.API.RoomRequest.downloadRoom(n);yield u.FS.createShadow(t,o);const i=yield d.API.RoomRequest.createSocket();return i.on("disconnect",()=>{e.webContents.send(s.DISCONNECTED)}),i.emit(p.Events.room_join,n),yield new Promise((o,r)=>{i.once(p.Events.room_join_res,c=>v(this,void 0,void 0,(function*(){c.ok||r(),u.FS.listenForLocalFileChanges(t,e=>{i.emit(p.Events.room_file_change,{change:e,roomId:n})}),u.FS.listenForLocalPatches(t,e=>{i.emit(p.Events.room_file_change,{change:e,roomId:n})}),i.on(p.Events.room_file_change_res,o=>v(this,void 0,void 0,(function*(){if(o.change.event===f.FileEvent.FILE_MODIFIED){console.log("File patched: "+o.change.path);const e=o.change;yield u.FS.applyPatches(t,e)}else{const n=o.change;yield u.FS.applyFileChange(t,n);const i=R.getTreeData(t);e.webContents.send(s.UPDATE_FOLDER,i),console.log("File changed: "+o.change.path)}}))),R.connection={socket:i,room:{roomId:n,source:t}},o(R.connection.room)})))})}))),m.handle(s.FETCH_LOG,(e,o)=>v(this,void 0,void 0,(function*(){return(yield d.API.LogsRequest.getAllLogs(o)).logs.map(e=>{var o,n;return{event:e.event,user:(null===(o=e.byWhom)||void 0===o?void 0:o.username)||"Unknown",date:new Date(e.date).toLocaleString(),path:(null===(n=e.body)||void 0===n?void 0:n.path)||""}})}))),m.handle(s.FETCH_FOLDER,(e,o)=>v(this,void 0,void 0,(function*(){return R.getTreeData(o)}))),m.handle(s.FETCH_USERS,(e,o)=>v(this,void 0,void 0,(function*(){return(yield d.API.RoomRequest.listUsersInRoom(o)).users}))),m.handle(s.CREATE_WINDOW,(e,o)=>v(this,void 0,void 0,(function*(){let e=new _({width:o.width,height:o.height,webPreferences:{nodeIntegration:!0}});return e.on("close",()=>{e=null}),e.loadURL(`${process.env.URL}${o.path}`),e.show(),!0})))}}R.getUsers=e=>v(void 0,void 0,void 0,(function*(){const o=yield d.API.RoomRequest.listUsersInRoom(e);return!!o.ok&&o.users})),R.getTreeData=e=>(new h.FileTree).make(e);const{app:g,BrowserWindow:O}=n(3);class w{static onWindowAllClosed(){"darwin"!==process.platform&&w.app.quit()}static onClose(){w.mainWindow=null}static onReady(){w.mainWindow=new O({width:900,height:680,webPreferences:{nodeIntegration:!0}}),console.log(">>>","production"),process.env.URL="file://"+r.a.resolve("resources/app.asar/build/index.html");process.env.SERVER_ENDPOINT="http://it-pr-itpro-duw4azjoa0r0-1588304925.eu-west-1.elb.amazonaws.com",console.log(process.env.URL),w.mainWindow.loadURL(process.env.URL),w.mainWindow.on("closed",w.onClose),R.init(w.mainWindow)}static init(){w.app=g,w.app.on("window-all-closed",w.onWindowAllClosed),w.app.on("ready",w.onReady)}}w.init()}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibHVtaS1jbGkvZGlzdC9hcGkvQVBJXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibHVtaS1jbGkvZGlzdC9saWIvY29tbW9uL0ZTXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibHVtaS1jbGkvZGlzdC9hcGkvcm91dGVzL1NvY2tldEV2ZW50c1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImx1bWktY2xpL2Rpc3QvbGliL2NvbW1vbi90eXBlc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImx1bWktY2xpL2Rpc3QvbGliL2NvbW1vbi9GaWxlVHJlZVwiIiwid2VicGFjazovLy8uLi9zcmMvcGFnZXMvcGF0aHMudHMiLCJ3ZWJwYWNrOi8vLy4uL3NyYy9jb250ZXh0L2lwYy1ldmVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25hdm1lbnUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2lwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOlsiaW5zdGFsbGVkTW9kdWxlcyIsIl9fd2VicGFja19yZXF1aXJlX18iLCJtb2R1bGVJZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJpIiwibCIsIm1vZHVsZXMiLCJjYWxsIiwibSIsImMiLCJkIiwibmFtZSIsImdldHRlciIsIm8iLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJnZXQiLCJyIiwiU3ltYm9sIiwidG9TdHJpbmdUYWciLCJ2YWx1ZSIsInQiLCJtb2RlIiwiX19lc01vZHVsZSIsIm5zIiwiY3JlYXRlIiwia2V5IiwiYmluZCIsIm4iLCJvYmplY3QiLCJwcm9wZXJ0eSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwicCIsInMiLCJyZXF1aXJlIiwiUGF0aHMiLCJJUENFdmVudHMiLCJNZW51IiwiTWVudUl0ZW0iLCJpcGNNYWluIiwiZGlhbG9nIiwiQnJvd3NlcldpbmRvdyIsIm1haW5XaW5kb3ciLCJoYW5kbGUiLCJDSEVDS19DT05ORUNUSU9OIiwidW5kZWZpbmVkIiwiY29ubmVjdGlvbiIsInJvb20iLCJTRUxFQ1RfRElSIiwic2hvd09wZW5EaWFsb2ciLCJwcm9wZXJ0aWVzIiwiZmlsZVBhdGhzIiwiQ1JFQVRFX1JPT00iLCJfIiwicGF0aCIsImJ1ZmZlciIsInppcCIsIlJvb21SZXF1ZXN0Iiwicm9vbUlkIiwiSk9JTl9ST09NIiwic291cmNlIiwiY29uc29sZSIsImxvZyIsInNvY2tldCIsImRpc2Nvbm5lY3QiLCJ6aXBwZWRSb29tIiwiZG93bmxvYWRSb29tIiwiY3JlYXRlU2hhZG93IiwiY3JlYXRlU29ja2V0Iiwib24iLCJ3ZWJDb250ZW50cyIsInNlbmQiLCJESVNDT05ORUNURUQiLCJlbWl0Iiwicm9vbV9qb2luIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbmNlIiwicm9vbV9qb2luX3JlcyIsInJlc3BvbnNlIiwib2siLCJsaXN0ZW5Gb3JMb2NhbEZpbGVDaGFuZ2VzIiwiZmlsZUNoYW5nZSIsInJvb21fZmlsZV9jaGFuZ2UiLCJjaGFuZ2UiLCJsaXN0ZW5Gb3JMb2NhbFBhdGNoZXMiLCJwYXRjaCIsInJvb21fZmlsZV9jaGFuZ2VfcmVzIiwiZmlsZUV2ZW50UmVxdWVzdCIsImV2ZW50IiwiRklMRV9NT0RJRklFRCIsImFwcGx5UGF0Y2hlcyIsImFwcGx5RmlsZUNoYW5nZSIsInRyZWVEYXRhIiwiZ2V0VHJlZURhdGEiLCJVUERBVEVfRk9MREVSIiwiRkVUQ0hfTE9HIiwiYW1vdW50IiwiTG9nc1JlcXVlc3QiLCJnZXRBbGxMb2dzIiwibG9ncyIsIm1hcCIsInVzZXIiLCJieVdob20iLCJ1c2VybmFtZSIsImRhdGUiLCJEYXRlIiwidG9Mb2NhbGVTdHJpbmciLCJib2R5IiwiRkVUQ0hfRk9MREVSIiwiRkVUQ0hfVVNFUlMiLCJsaXN0VXNlcnNJblJvb20iLCJ1c2VycyIsIkNSRUFURV9XSU5ET1ciLCJ3aW5Qcm9wcyIsIndpbiIsIndpZHRoIiwiaGVpZ2h0Iiwid2ViUHJlZmVyZW5jZXMiLCJub2RlSW50ZWdyYXRpb24iLCJsb2FkVVJMIiwicHJvY2VzcyIsImVudiIsIlVSTCIsInNob3ciLCJnZXRVc2VycyIsInNlcnZlclJlc3BvbnNlIiwibWFrZSIsImFwcCIsInBsYXRmb3JtIiwicXVpdCIsIlNFUlZFUl9FTkRQT0lOVCIsIm9uQ2xvc2UiLCJpbml0Iiwib25XaW5kb3dBbGxDbG9zZWQiLCJvblJlYWR5Il0sIm1hcHBpbmdzIjoiYUFDRSxJQUFJQSxFQUFtQixHQUd2QixTQUFTQyxFQUFvQkMsR0FHNUIsR0FBR0YsRUFBaUJFLEdBQ25CLE9BQU9GLEVBQWlCRSxHQUFVQyxRQUduQyxJQUFJQyxFQUFTSixFQUFpQkUsR0FBWSxDQUN6Q0csRUFBR0gsRUFDSEksR0FBRyxFQUNISCxRQUFTLElBVVYsT0FOQUksRUFBUUwsR0FBVU0sS0FBS0osRUFBT0QsUUFBU0MsRUFBUUEsRUFBT0QsUUFBU0YsR0FHL0RHLEVBQU9FLEdBQUksRUFHSkYsRUFBT0QsUUFLZkYsRUFBb0JRLEVBQUlGLEVBR3hCTixFQUFvQlMsRUFBSVYsRUFHeEJDLEVBQW9CVSxFQUFJLFNBQVNSLEVBQVNTLEVBQU1DLEdBQzNDWixFQUFvQmEsRUFBRVgsRUFBU1MsSUFDbENHLE9BQU9DLGVBQWViLEVBQVNTLEVBQU0sQ0FBRUssWUFBWSxFQUFNQyxJQUFLTCxLQUtoRVosRUFBb0JrQixFQUFJLFNBQVNoQixHQUNYLG9CQUFYaUIsUUFBMEJBLE9BQU9DLGFBQzFDTixPQUFPQyxlQUFlYixFQUFTaUIsT0FBT0MsWUFBYSxDQUFFQyxNQUFPLFdBRTdEUCxPQUFPQyxlQUFlYixFQUFTLGFBQWMsQ0FBRW1CLE9BQU8sS0FRdkRyQixFQUFvQnNCLEVBQUksU0FBU0QsRUFBT0UsR0FFdkMsR0FEVSxF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STRELFFBQVFDLElBQUlDLEtBRXhCLEVBQUtsRixXQUFXK0UsUUFBUUMsUUFBUUMsSUFBSUMsS0FDcEMsRUFBS2xGLFdBQVcyQixHQUFHLFNBQVUsRUFBS2dFLFNBRWxDLEVBQUlDLEtBQUssRUFBSzVGLFlBR2hCLGNBQ0UsRUFBS3VGLElBQU1BLEVBQ1gsRUFBS0EsSUFBSTVELEdBQUcsb0JBQXFCLEVBQUtrRSxtQkFDdEMsRUFBS04sSUFBSTVELEdBQUcsUUFBUyxFQUFLbUUsVUN0RDlCLEVBQUtGIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA3KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImx1bWktY2xpL2Rpc3QvYXBpL0FQSVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJsdW1pLWNsaS9kaXN0L2xpYi9jb21tb24vRlNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibHVtaS1jbGkvZGlzdC9hcGkvcm91dGVzL1NvY2tldEV2ZW50c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImx1bWktY2xpL2Rpc3QvbGliL2NvbW1vbi90eXBlc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJsdW1pLWNsaS9kaXN0L2xpYi9jb21tb24vRmlsZVRyZWVcIik7IiwiZW51bSBQYXRocyB7XG4gIFRPUF9CQVIgPSBcIi9cIixcbiAgSE9NRSA9IFwiL2hvbWVcIixcbiAgU1RBUlQgPSBcIi9zdGFydFwiLFxuICBMT0FESU5HID0gXCIvbG9hZGluZ1wiLFxuICBJTlZJVEUgPSBcIi9pbnZpdGVcIixcbiAgU0VUVElOR1MgPSBcIi9zZXR0aW5nc1wiLFxuICBMRUFWRSA9IFwiL2xlYXZlXCIsXG4gIFJPT00gPSBcIi9yb29tXCIsXG4gIFNFUlZFUl9MT0cgPSBcIi9zZXJ2ZXJsb2dcIixcbn1cblxuZXhwb3J0IGRlZmF1bHQgUGF0aHM7XG4iLCJlbnVtIElQQ0V2ZW50cyB7XG4gIFNFTEVDVF9ESVIgPSBcInNlbGVjdF9kaXJcIixcbiAgQ1JFQVRFX1JPT00gPSBcImNyZWF0ZV9yb29tXCIsXG4gIEpPSU5fUk9PTSA9IFwiam9pbl9yb29tXCIsXG4gIE5BVklHQVRFID0gXCJuYXZpZ2F0ZVwiLFxuICBESVNDT05ORUNURUQgPSBcImRpc2Nvbm5lY3RlZFwiLFxuICBDSEVDS19DT05ORUNUSU9OID0gXCJjaGVja19jb25uZWN0aW9uXCIsXG4gIEZFVENIX0xPRyA9IFwiZmV0Y2hfbG9nXCIsXG4gIEZFVENIX0ZPTERFUiA9IFwiZmV0Y2hfZm9sZGVyXCIsXG4gIEZFVENIX1VTRVJTID0gXCJmZXRjaF91c2Vyc1wiLFxuICBDUkVBVEVfV0lORE9XID0gXCJjcmVhdGVfd2luZG93XCIsXG4gIFVQREFURV9GT0xERVIgPSBcInVwZGF0ZV9mb2xkZXJcIixcbiAgVVBEQVRFX1VTRVJTID0gXCJ1cGRhdGVfdXNlcnNcIixcbn1cblxuZXhwb3J0IGRlZmF1bHQgSVBDRXZlbnRzO1xuIiwiaW1wb3J0IFBhdGhzIGZyb20gXCIuLi8uLi9zcmMvcGFnZXMvcGF0aHNcIjtcbmltcG9ydCBJUENFdmVudHMgZnJvbSBcIi4uLy4uL3NyYy9jb250ZXh0L2lwYy1ldmVudHNcIjtcblxuY29uc3QgeyBNZW51LCBNZW51SXRlbSB9ID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xuXG5jb25zdCBuYXZNZW51ID0gKHdpbjogYW55KTogYW55ID0+IHtcbiAgY29uc3QgbWVudSA9IE1lbnUuZ2V0QXBwbGljYXRpb25NZW51KCk7XG5cbiAgY29uc3Qgc3VibWVudTogYW55ID0gW107XG4gIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhQYXRocykpIHtcbiAgICBzdWJtZW51LnB1c2goe1xuICAgICAgbGFiZWw6IGtleSxcbiAgICAgIGNsaWNrKCkge1xuICAgICAgICAvLyBUT0RPIHJlc3BvbmQgb24gcmVhY3Qgc2lkZSBhbmQgcmVkaXJlY3RcbiAgICAgICAgd2luLndlYkNvbnRlbnRzLnNlbmQoSVBDRXZlbnRzLk5BVklHQVRFLCB2YWx1ZSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgbmF2SXRlbSA9IG5ldyBNZW51SXRlbSh7XG4gICAgbGFiZWw6IFwiTmF2aWdhdGVcIixcbiAgICBzdWJtZW51LFxuICB9KTtcblxuICBtZW51LmFwcGVuZChuYXZJdGVtKTtcbiAgTWVudS5zZXRBcHBsaWNhdGlvbk1lbnUobWVudSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBuYXZNZW51O1xuIiwiaW1wb3J0IHsgQVBJIH0gZnJvbSBcImx1bWktY2xpL2Rpc3QvYXBpL0FQSVwiO1xuaW1wb3J0IHsgRlMgfSBmcm9tIFwibHVtaS1jbGkvZGlzdC9saWIvY29tbW9uL0ZTXCI7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwibHVtaS1jbGkvZGlzdC9hcGkvcm91dGVzL1NvY2tldEV2ZW50c1wiO1xuaW1wb3J0IHtcbiAgRmlsZUV2ZW50LFxuICBGaWxlRXZlbnRSZXF1ZXN0LFxuICBJUGF0Y2gsXG4gIElGaWxlQ2hhbmdlLFxufSBmcm9tIFwibHVtaS1jbGkvZGlzdC9saWIvY29tbW9uL3R5cGVzXCI7XG5pbXBvcnQgeyBGaWxlVHJlZSB9IGZyb20gXCJsdW1pLWNsaS9kaXN0L2xpYi9jb21tb24vRmlsZVRyZWVcIjtcbmltcG9ydCB7IFdpbmRvdywgUm9vbSB9IGZyb20gXCIuLi8uLi9zcmMvY29udGV4dC9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgSVBDRXZlbnRzIGZyb20gXCIuLi8uLi9zcmMvY29udGV4dC9pcGMtZXZlbnRzXCI7XG5cbmNvbnN0IHsgaXBjTWFpbiwgZGlhbG9nLCBCcm93c2VyV2luZG93IH0gPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7XG5cbmludGVyZmFjZSBDb25uZWN0aW9uIHtcbiAgc29ja2V0OiBTb2NrZXRJT0NsaWVudC5Tb2NrZXQ7XG4gIHJvb206IFJvb207XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElQQyB7XG4gIHN0YXRpYyBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xuXG4gIHN0YXRpYyBnZXRVc2VycyA9IGFzeW5jIChyb29tSWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHNlcnZlclJlc3BvbnNlID0gYXdhaXQgQVBJLlJvb21SZXF1ZXN0Lmxpc3RVc2Vyc0luUm9vbShyb29tSWQpO1xuICAgIGlmIChzZXJ2ZXJSZXNwb25zZS5vaykge1xuICAgICAgcmV0dXJuIHNlcnZlclJlc3BvbnNlLnVzZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIHN0YXRpYyBnZXRUcmVlRGF0YSA9IChwYXRoOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gbmV3IEZpbGVUcmVlKCkubWFrZShwYXRoKTtcbiAgfTtcblxuICBzdGF0aWMgaW5pdChtYWluV2luZG93OiBhbnkpIHtcbiAgICBpcGNNYWluLmhhbmRsZShJUENFdmVudHMuQ0hFQ0tfQ09OTkVDVElPTiwgKCkgPT4ge1xuICAgICAgaWYgKElQQy5jb25uZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIElQQy5jb25uZWN0aW9uLnJvb207XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIGlwY01haW4uaGFuZGxlKElQQ0V2ZW50cy5TRUxFQ1RfRElSLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkaWFsb2cuc2hvd09wZW5EaWFsb2cobWFpbldpbmRvdywge1xuICAgICAgICBwcm9wZXJ0aWVzOiBbXCJvcGVuRGlyZWN0b3J5XCJdLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0LmZpbGVQYXRoc1swXTtcbiAgICB9KTtcblxuICAgIGlwY01haW4uaGFuZGxlKElQQ0V2ZW50cy5DUkVBVEVfUk9PTSwgYXN5bmMgKF8sIHBhdGgpID0+IHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IEZTLnppcChwYXRoKTtcbiAgICAgIGNvbnN0IHNlcnZlclJlc3BvbnNlID0gYXdhaXQgQVBJLlJvb21SZXF1ZXN0LmNyZWF0ZShidWZmZXIpO1xuICAgICAgcmV0dXJuIHNlcnZlclJlc3BvbnNlLnJvb21JZDtcbiAgICB9KTtcblxuICAgIGlwY01haW4uaGFuZGxlKElQQ0V2ZW50cy5KT0lOX1JPT00sIGFzeW5jIChfLCByb29tSWQsIHNvdXJjZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJKT0lOSU5HIFJPT01cIik7XG4gICAgICBjb25zb2xlLmxvZyhyb29tSWQsIHNvdXJjZSk7XG5cbiAgICAgIGlmIChJUEMuY29ubmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIElQQy5jb25uZWN0aW9uLnNvY2tldC5kaXNjb25uZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHppcHBlZFJvb20gPSBhd2FpdCBBUEkuUm9vbVJlcXVlc3QuZG93bmxvYWRSb29tKHJvb21JZCk7XG4gICAgICBhd2FpdCBGUy5jcmVhdGVTaGFkb3coc291cmNlLCB6aXBwZWRSb29tKTtcblxuICAgICAgY29uc3Qgc29ja2V0ID0gYXdhaXQgQVBJLlJvb21SZXF1ZXN0LmNyZWF0ZVNvY2tldCgpO1xuXG4gICAgICBzb2NrZXQub24oXCJkaXNjb25uZWN0XCIsICgpID0+IHtcbiAgICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKElQQ0V2ZW50cy5ESVNDT05ORUNURUQpO1xuICAgICAgfSk7XG5cbiAgICAgIHNvY2tldC5lbWl0KEV2ZW50cy5yb29tX2pvaW4sIHJvb21JZCk7XG5cbiAgICAgIGNvbnN0IHJvb20gPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHNvY2tldC5vbmNlKEV2ZW50cy5yb29tX2pvaW5fcmVzLCBhc3luYyAocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHJlamVjdCgpO1xuXG4gICAgICAgICAgRlMubGlzdGVuRm9yTG9jYWxGaWxlQ2hhbmdlcyhzb3VyY2UsIChmaWxlQ2hhbmdlOiBJRmlsZUNoYW5nZSkgPT4ge1xuICAgICAgICAgICAgc29ja2V0LmVtaXQoRXZlbnRzLnJvb21fZmlsZV9jaGFuZ2UsIHtcbiAgICAgICAgICAgICAgY2hhbmdlOiBmaWxlQ2hhbmdlLFxuICAgICAgICAgICAgICByb29tSWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIEZTLmxpc3RlbkZvckxvY2FsUGF0Y2hlcyhzb3VyY2UsIChwYXRjaDogSVBhdGNoKSA9PiB7XG4gICAgICAgICAgICBzb2NrZXQuZW1pdChFdmVudHMucm9vbV9maWxlX2NoYW5nZSwgeyBjaGFuZ2U6IHBhdGNoLCByb29tSWQgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBUZWxsIHRoZSBzZXJ2ZXIgd2Ugd291bGQgbGlrZSB0byBqb2luLlxuICAgICAgICAgIHNvY2tldC5vbihcbiAgICAgICAgICAgIEV2ZW50cy5yb29tX2ZpbGVfY2hhbmdlX3JlcyxcbiAgICAgICAgICAgIGFzeW5jIChmaWxlRXZlbnRSZXF1ZXN0OiBGaWxlRXZlbnRSZXF1ZXN0KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChmaWxlRXZlbnRSZXF1ZXN0LmNoYW5nZS5ldmVudCA9PT0gRmlsZUV2ZW50LkZJTEVfTU9ESUZJRUQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRmlsZSBwYXRjaGVkOiAke2ZpbGVFdmVudFJlcXVlc3QuY2hhbmdlLnBhdGh9YCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0Y2ggPSBmaWxlRXZlbnRSZXF1ZXN0LmNoYW5nZSBhcyBJUGF0Y2g7XG4gICAgICAgICAgICAgICAgYXdhaXQgRlMuYXBwbHlQYXRjaGVzKHNvdXJjZSwgcGF0Y2gpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVDaGFuZ2UgPSBmaWxlRXZlbnRSZXF1ZXN0LmNoYW5nZSBhcyBJRmlsZUNoYW5nZTtcbiAgICAgICAgICAgICAgICBhd2FpdCBGUy5hcHBseUZpbGVDaGFuZ2Uoc291cmNlLCBmaWxlQ2hhbmdlKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRyZWVEYXRhID0gSVBDLmdldFRyZWVEYXRhKHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKElQQ0V2ZW50cy5VUERBVEVfRk9MREVSLCB0cmVlRGF0YSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRmlsZSBjaGFuZ2VkOiAke2ZpbGVFdmVudFJlcXVlc3QuY2hhbmdlLnBhdGh9YCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy8gc29ja2V0Lm9uKEV2ZW50cy5yb29tX25ld191c2VyLCAodXNlcjogYW55KSA9PiB7XG4gICAgICAgICAgLy8gICBjb25zb2xlLmxvZyh1c2VyKTtcbiAgICAgICAgICAvLyAgIC8vIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZChJUENFdmVudHMuVVBEQVRFX1VTRVJTLCB0cmVlRGF0YSk7XG4gICAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgICBJUEMuY29ubmVjdGlvbiA9IHtcbiAgICAgICAgICAgIHNvY2tldCxcbiAgICAgICAgICAgIHJvb206IHtcbiAgICAgICAgICAgICAgcm9vbUlkLFxuICAgICAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXNvbHZlKElQQy5jb25uZWN0aW9uLnJvb20pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcm9vbTtcbiAgICB9KTtcblxuICAgIGlwY01haW4uaGFuZGxlKElQQ0V2ZW50cy5GRVRDSF9MT0csIGFzeW5jIChfLCBhbW91bnQ6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgQVBJLkxvZ3NSZXF1ZXN0LmdldEFsbExvZ3MoYW1vdW50KTtcbiAgICAgIHJldHVybiByZXMubG9ncy5tYXAoKGwpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBldmVudDogbC5ldmVudCxcbiAgICAgICAgICB1c2VyOiBsLmJ5V2hvbT8udXNlcm5hbWUgfHwgXCJVbmtub3duXCIsXG4gICAgICAgICAgZGF0ZTogbmV3IERhdGUobC5kYXRlKS50b0xvY2FsZVN0cmluZygpLFxuICAgICAgICAgIHBhdGg6IGwuYm9keT8ucGF0aCB8fCBcIlwiLFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpcGNNYWluLmhhbmRsZShJUENFdmVudHMuRkVUQ0hfRk9MREVSLCBhc3luYyAoXywgcGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gSVBDLmdldFRyZWVEYXRhKHBhdGgpO1xuICAgIH0pO1xuXG4gICAgaXBjTWFpbi5oYW5kbGUoSVBDRXZlbnRzLkZFVENIX1VTRVJTLCBhc3luYyAoXywgcm9vbUlkOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IEFQSS5Sb29tUmVxdWVzdC5saXN0VXNlcnNJblJvb20ocm9vbUlkKTtcbiAgICAgIHJldHVybiByZXMudXNlcnM7XG4gICAgfSk7XG5cbiAgICBpcGNNYWluLmhhbmRsZShJUENFdmVudHMuQ1JFQVRFX1dJTkRPVywgYXN5bmMgKF8sIHdpblByb3BzOiBXaW5kb3cpID0+IHtcbiAgICAgIGxldCB3aW4gPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICAgIHdpZHRoOiB3aW5Qcm9wcy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB3aW5Qcm9wcy5oZWlnaHQsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICB3aW4ub24oXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgIHdpbiA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIHdpbi5sb2FkVVJMKGAke3Byb2Nlc3MuZW52LlVSTH0ke3dpblByb3BzLnBhdGh9YCk7XG4gICAgICB3aW4uc2hvdygpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBuYXZNZW51IGZyb20gXCIuL25hdm1lbnVcIjtcbmltcG9ydCBJUEMgZnJvbSBcIi4vaXBjXCI7XG5cbmNvbnN0IHsgYXBwLCBCcm93c2VyV2luZG93IH0gPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW4ge1xuICBzdGF0aWMgbWFpbldpbmRvdzogYW55O1xuICBzdGF0aWMgYXBwOiBhbnk7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgb25XaW5kb3dBbGxDbG9zZWQoKSB7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09IFwiZGFyd2luXCIpIHtcbiAgICAgIE1haW4uYXBwLnF1aXQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBvbkNsb3NlKCkge1xuICAgIE1haW4ubWFpbldpbmRvdyA9IG51bGw7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBvblJlYWR5KCkge1xuICAgIE1haW4ubWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgIHdpZHRoOiA5MDAsXG4gICAgICBoZWlnaHQ6IDY4MCxcbiAgICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhcIj4+PlwiLCBwcm9jZXNzLmVudi5OT0RFX0VOVik7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIikge1xuICAgICAgcHJvY2Vzcy5lbnYuVVJMID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIjtcbiAgICAgIG5hdk1lbnUoTWFpbi5tYWluV2luZG93KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvY2Vzcy5lbnYuVVJMID0gYGZpbGU6Ly8ke3BhdGgucmVzb2x2ZShcbiAgICAgICAgXCJyZXNvdXJjZXMvYXBwLmFzYXIvYnVpbGQvaW5kZXguaHRtbFwiXG4gICAgICApfWA7XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYWwgPSBmYWxzZTtcbiAgICBwcm9jZXNzLmVudi5TRVJWRVJfRU5EUE9JTlQgPSBsb2NhbFxuICAgICAgPyBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiXG4gICAgICA6IFwiaHR0cDovL2l0LXByLWl0cHJvLWR1dzRhempvYTByMC0xNTg4MzA0OTI1LmV1LXdlc3QtMS5lbGIuYW1hem9uYXdzLmNvbVwiO1xuXG4gICAgY29uc29sZS5sb2cocHJvY2Vzcy5lbnYuVVJMKTtcblxuICAgIE1haW4ubWFpbldpbmRvdy5sb2FkVVJMKHByb2Nlc3MuZW52LlVSTCk7XG4gICAgTWFpbi5tYWluV2luZG93Lm9uKFwiY2xvc2VkXCIsIE1haW4ub25DbG9zZSk7XG5cbiAgICBJUEMuaW5pdChNYWluLm1haW5XaW5kb3cpO1xuICB9XG5cbiAgc3RhdGljIGluaXQoKSB7XG4gICAgTWFpbi5hcHAgPSBhcHA7XG4gICAgTWFpbi5hcHAub24oXCJ3aW5kb3ctYWxsLWNsb3NlZFwiLCBNYWluLm9uV2luZG93QWxsQ2xvc2VkKTtcbiAgICBNYWluLmFwcC5vbihcInJlYWR5XCIsIE1haW4ub25SZWFkeSk7XG4gIH1cbn1cbiIsImltcG9ydCBNYWluIGZyb20gXCIuL21haW5cIjtcblxuTWFpbi5pbml0KCk7XG4iXSwic291cmNlUm9vdCI6IiJ9