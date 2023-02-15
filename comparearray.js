/*
  # return number
  * 0: equal in structure and values
  * 1: equal in structure but different values
  * 2: different structure
*/
function comparearray(array0, array1) {
  let message = {
    "invalidArgument": "引数が不正です。"
  }
  let fn = {
    operateDouble: async (targetFunction, argumentArray) => {
      return [await targetFunction(argumentArray[0]), await targetFunction(argumentArray[1])]
    },
    breakDimension: array => {
      let work = []
      return dimensionTraveler(array, [], [])
      function dimensionTraveler(content, passingPoint) {
        return new Promise((resolve, reject) => {
          if (!(content instanceof Array) && !(content instanceof Object)) {
            resolve(work.push({"content": content, "passingPoint": passingPoint}))
          }
          else {
            let isobject = false
            if (content instanceof Object) isobject = true
            let promiseArray = []
            for (let i in content) {
              promiseArray.push(dimensionTraveler(content[i], passingPoint.concat(i.toString())))
            }
            Promise.all(promiseArray)
            .then(() => {
              resolve(work)
            })
            .catch(rly => {
              reject(rly)
            })
          }
        })
      }
    },
    analyzeStructure: work => {
      let digitsArray = []
      for (let i in work) {
        for (let j in work[i].passingPoint) {
          if (digitsArray[j] === undefined) {
            digitsArray[j] = 0
          }
          digitsArray[j] = Math.max(digitsArray[j], work[i].passingPoint[j].length)
        }
      }
      for (let i in work) {
        for (let j in work[i].passingPoint) {
          work[i].passingPoint[j] = `${"0".repeat(digitsArray[j] - 1)}${work[i].passingPoint[j]}`.slice(-digitsArray[j])
        }
        work[i].structure = work[i].passingPoint.slice(0, digitsArray.length - 1).join("")
      }
      let digitsNumeric = 0
      for (let i in work) {
        digitsNumeric = Math.max(digitsNumeric, work[i].passingPoint[0].length)
      }
      for (let i in work) {
        work[i].dna = `${work[i].passingPoint}${"0".repeat(digitsNumeric - 1)}`.slice(0, digitsNumeric)
      }
      return work.sort((a, b) => a.dna - b.dna)
    },
    compareArray: work => {
      for (let i in work[0]) {
        if (work[0][i].structure !== work[1][i].structure) {
          return 2 // different structure
        }
        else if (work[0][i].content instanceof Object) {
          if (work[0][i].content.length !== work[1][i].content.length) {
            return 2 // different structure
          }
          else {
            for (let j in work[0][i].content) {
              if (work[1][i].content[j] === undefined) {
                return 2 // different structure
              }
            }
          }
        }
      }
      for (let i in work[0]) {
        if (!(work[0][i].content instanceof Object) && work[0][i].content !== work[1][i].content) {
          return 1 // equal in structure but different value
        }
        else {
          for (let j in work[0][i].content) {
            if (work[0][i].content[j] !== work[1][i].content[j]) {
              return 1 // equal in structure but different value
            }
          }
        }
      }
      return 0 // equal in structure and value
    }
  }
  if ((!(array0 instanceof Array) && !(array0 instanceof Object)) || (!(array1 instanceof Array) && !(array1 instanceof Object))) {
    return new Promise(reject => {
      console.log(message.invalidArgument)
      reject(false)
    })
  }
  return fn.operateDouble(fn.breakDimension, [array0, array1])
  .then(rly => {
    return fn.operateDouble(fn.analyzeStructure, [rly[0], rly[1]])
  })
  .then(rly => {
    return fn.compareArray(rly)
  })
}
