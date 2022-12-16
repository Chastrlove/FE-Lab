const path = require("path");
const {
  getType,
  PathType,
  cachedJoin,
} = require("enhanced-resolve/lib/util/path");
const fs = require("fs");
const globby = require("globby");

module.exports = class EnvPathPlugin {
  constructor(options) {
    this.suffix = ".bd";
  }

  apply(resolver) {
    const suffix = this.suffix;
    const { alias, extensions } = resolver.options;
    const extensionList = [...extensions].map((ext) =>
      ext.slice(1, ext.length)
    );
    const extensionRegex = new RegExp(`(.*)(\\.(${extensionList.join("|")}))$`);

    const target = resolver.ensureHook("resolve");
    resolver
      .getHook("before-resolve")
      .tapAsync(
        "ResolveFallback",
        async (request, resolveContext, callback) => {
          const { request: innerRequest, path: requestPath } = request;
          const pathType = getType(request.request);

          const isStartWithAlias = (path) => {
            for (let key in alias) {
              if (path.startsWith(key.name)) {
                return true;
              }
            }
            return false;
          };

          const joinPath = (path) => {
            const pathWithoutExt = path.replace(extensionRegex, "$1");
            return cachedJoin(requestPath, `${pathWithoutExt}${suffix}`);
          };

          const createNewRequest = (oldRequest) => {
            switch (pathType) {
              case PathType.Normal:
                if (isStartWithAlias(oldRequest)) {
                  return joinPath(oldRequest);
                }
                return oldRequest;
              case PathType.AbsolutePosix:
              case PathType.AbsoluteWin:
              case PathType.Relative:
                return joinPath(oldRequest);
              default:
                return oldRequest;
            }
          };

          const newRequest = createNewRequest(innerRequest);

          const paths = await globby(
            `${newRequest}.{${extensionList.join(",")}}`
          );

          if (newRequest === innerRequest || paths.length === 0) {
            callback();
          } else {
            const obj = {
              ...request,
              request: newRequest,
            };
            resolver.doResolve(target, obj, null, resolveContext, callback);
          }
        }
      );
  }
};
