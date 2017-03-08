let utils = {
  logError: (event) => {
    console.log("Database error: ", event.target.errorCode);
  },
  defineStore: (name: string,
                indices: Array<{
                  name: string,
                  keyPath: string | Array<string>,
                  optionalParameters: Object
                }>,
                optionalParameters: Object = {}) => {
                let store = {
                  'name': name,
                  'optionalParameters': optionalParameters,
                  'indices': []
                }
                for (let index of indices) {
                  store.indices.push({
                    'name': index.name,
                    'keyPath': index.keyPath,
                    'optionalParameters': index.optionalParameters
                  });
                }
                return store;
              },
  defineIndex: (name: string,
                keyPath: string = name,
                optionalParameters: Object = {}) => {
                  let index = {
                    'name': name,
                    'keyPath': keyPath,
                    'optionalParameters': optionalParameters
                  }
                  return index;
                }
};

export { utils };
