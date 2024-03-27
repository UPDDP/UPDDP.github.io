topo_building = (req, data, sol) => {
  let topo = {
    req_list: req,
    data_list: [...data["dataset"], ...data["category"], ...data["direction"]],
    sol_list: [
      ...sol["data_manipulation"],
      ...sol["vis_component"],
      ...sol["interaction"]
    ],
    data_manipulation_list: sol["data_manipulation"],
    interaction_list: sol["interaction"]
  }
  let all_list = []
  d3.map(topo.req_list, (d) => all_list.push({ id: d, group: 1 }))
  d3.map(topo.data_list, (d) => all_list.push({ id: d, group: 2 }))
  d3.map(topo.sol_list, (d) => all_list.push({ id: d, group: 3 }))

  topo.all_list = all_list

  return topo
}

topo_merge = (topo_main, topo_iter) => {
  let out_key_list = Object.keys(topo_iter)
  for (
    let out_key_index = 0;
    out_key_index < out_key_list.length;
    out_key_index++
  ) {
    let out_key = out_key_list[out_key_index]
    let in_key_list = Object.keys(topo_iter[out_key])
    for (
      let in_key_index = 0;
      in_key_index < in_key_list.length;
      in_key_index++
    ) {
      let in_key = in_key_list[in_key_index]

      topo_main[out_key][in_key] += topo_iter[out_key][in_key]
    }
  }
  return topo_main
}

topo_reparameter = (topo, factor) => {
  let out_key_list = Object.keys(topo)
  for (
    let out_key_index = 0;
    out_key_index < out_key_list.length;
    out_key_index++
  ) {
    let out_key = out_key_list[out_key_index]
    let in_key_list = Object.keys(topo[out_key])
    for (
      let in_key_index = 0;
      in_key_index < in_key_list.length;
      in_key_index++
    ) {
      let in_key = in_key_list[in_key_index]

      topo[out_key][in_key] = topo[out_key][in_key] * factor
    }
  }
  return topo
}

req_data_empty_topo_building = (topo) => {
  let req_data_topo = {}
  for (let i = 0; i < topo.req_list.length; i++) {
    req_data_topo[topo.req_list[i]] = {}
    for (let j = 0; j < topo.data_list.length; j++) {
      req_data_topo[topo.req_list[i]][topo.data_list[j]] = 0
    }
  }
  return req_data_topo
}

data_sol_empty_topo_building = (topo) => {
  let data_sol_topo = {}
  for (let i = 0; i < topo.data_list.length; i++) {
    data_sol_topo[topo.data_list[i]] = {}
    for (let j = 0; j < topo.sol_list.length; j++) {
      data_sol_topo[topo.data_list[i]][topo.sol_list[j]] = 0
    }
  }
  return data_sol_topo
}
sol_sol_empty_topo_building = (topo) => {
  let sol_sol_topo = {}
  for (let i = 0; i < topo.sol_list.length; i++) {
    sol_sol_topo[topo.sol_list[i]] = {}
    for (let j = 0; j < topo.sol_list.length; j++) {
      sol_sol_topo[topo.sol_list[i]][topo.sol_list[j]] = 0
    }
  }
  return sol_sol_topo
}

calcualte_link = (topo_list) => {
  let factor = 0
  for (let i = 0; i < topo_list.length; i++) {
    let out_key_list = Object.keys(topo_list[i])
    for (
      let out_key_index = 0;
      out_key_index < out_key_list.length;
      out_key_index++
    ) {
      let in_key_list = Object.keys(topo_list[i][out_key_list[out_key_index]])
      for (
        let in_key_index = 0;
        in_key_index < in_key_list.length;
        in_key_index++
      ) {
        factor +=
          topo_list[i][out_key_list[out_key_index]][in_key_list[in_key_index]]
      }
    }
  }
  return factor
}

edge_building_unbalance = (data, topo) => {
  let req_data_topo = req_data_empty_topo_building(topo)
  let data_sol_topo = data_sol_empty_topo_building(topo)
  let sol_sol_topo = sol_sol_empty_topo_building(topo)
  let sol_sol_co = sol_sol_empty_topo_building(topo)

  for (let i = 0; i < data.length; i++) {
    let data_iter = data[i]

    let req_data_topo_iter = {}
    let data_sol_topo_iter = {}
    let sol_sol_topo_iter = {}
    let sol_sol_co_iter = {}
    let req_code_list = Object.keys(
      data_iter["requirement"]["requirement_code"]
    )
    let data_dict = data_iter["data"]["data_code"]
    let data_code_list = Object.keys(data_dict)

    for (let j = 0; j < req_code_list.length; j++) {
      req_data_topo_iter[req_code_list[j]] = {}
      for (let k = 0; k < data_code_list.length; k++) {
        //req_data_topo[req_code_list[j]][data_code_list[k]] +=data_dict[data_code_list[k]]
        if (!(req_code_list[j] in req_data_topo_iter)) {
          req_data_topo_iter[req_code_list[j]] = {}
        }
        req_data_topo_iter[req_code_list[j]][data_code_list[k]] = 1
      }
    }

    let sol_list_iter = []
    for (let j = 0; j < data_iter["solution"].length; j++) {
      let code_iter = data_iter["solution"][j]
      if (code_iter["solution_category"] == "data_manipulation") {
        for (let k = 0; k < code_iter["componenet_code"].length; k++) {
          sol_list_iter.push(code_iter["componenet_code"][k])
        }
      } else {
        sol_list_iter.push(code_iter["componenet_code"])
      }
    }

    let last_sol_code = sol_list_iter[0]
    for (let j = 0; j < data_code_list.length; j++) {
      for (let k = 0; k < last_sol_code.length; k++) {
        if (!(last_sol_code[k] in data_sol_topo_iter)) {
          data_sol_topo_iter[data_code_list[j]] = {}
        }
        if (!(last_sol_code[k] in data_sol_topo_iter[data_code_list[j]])) {
          data_sol_topo_iter[data_code_list[j]][last_sol_code[k]] = 0
        }
        data_sol_topo_iter[data_code_list[j]][last_sol_code[k]] += 1
      }
    }

    for (let j = 1; j < sol_list_iter.length; j++) {
      for (let in_iter = 0; in_iter < sol_list_iter[j].length; in_iter++) {
        for (let out_iter = 0; out_iter < last_sol_code.length; out_iter++) {
          if (!(last_sol_code[out_iter] in sol_sol_topo_iter)) {
            sol_sol_topo_iter[last_sol_code[out_iter]] = {}
          }
          if (
            !(
              sol_list_iter[j][in_iter] in
              sol_sol_topo_iter[last_sol_code[out_iter]]
            )
          ) {
            sol_sol_topo_iter[last_sol_code[out_iter]][
              sol_list_iter[j][in_iter]
            ] = 0
          }
          sol_sol_topo_iter[last_sol_code[out_iter]][
            sol_list_iter[j][in_iter]
          ] += 1
        }
        for (let co_iter = 0; co_iter < sol_list_iter[j].length; co_iter++) {
          if (in_iter != co_iter) {
            if (!(sol_list_iter[j][in_iter] in sol_sol_co_iter)) {
              sol_sol_co_iter[sol_list_iter[j][in_iter]] = {}
            }
            if (
              !(
                sol_list_iter[j][in_iter] in
                sol_sol_co_iter[sol_list_iter[j][in_iter]]
              )
            ) {
              sol_sol_co_iter[sol_list_iter[j][in_iter]][
                sol_list_iter[j][co_iter]
              ] = 1
            } else {
              sol_sol_co_iter[sol_list_iter[j][in_iter]][
                sol_list_iter[j][co_iter]
              ] += 1
            }
          }
        }
        last_sol_code = sol_list_iter[j]
      }
    }
    req_data_topo = topo_merge(req_data_topo, req_data_topo_iter)
    data_sol_topo = topo_merge(data_sol_topo, data_sol_topo_iter)
    sol_sol_topo = topo_merge(sol_sol_topo, sol_sol_topo_iter)
    sol_sol_co = topo_merge(sol_sol_co, sol_sol_co_iter)
  }
  console.log(req_data_topo, data_sol_topo, sol_sol_topo, sol_sol_co)
  return { req_data_topo, data_sol_topo, sol_sol_topo, sol_sol_co }
}

edge_building_path = (data, topo) => {
  let req_data_topo = req_data_empty_topo_building(topo)
  let data_sol_topo = data_sol_empty_topo_building(topo)
  let sol_sol_topo = sol_sol_empty_topo_building(topo)
  let sol_sol_co = sol_sol_empty_topo_building(topo)

  for (let i = 0; i < data.length; i++) {
    let data_iter = data[i]
    let factor = 0

    let req_data_topo_iter = {}
    let data_sol_topo_iter = {}
    let sol_sol_topo_iter = {}
    let sol_sol_co_iter = {}
    let req_code_list = Object.keys(
      data_iter["requirement"]["requirement_code"]
    )
    let data_dict = data_iter["data"]["data_code"]
    let data_code_list = Object.keys(data_dict)

    for (let j = 0; j < req_code_list.length; j++) {
      req_data_topo_iter[req_code_list[j]] = {}
      for (let k = 0; k < data_code_list.length; k++) {
        //req_data_topo[req_code_list[j]][data_code_list[k]] +=data_dict[data_code_list[k]]
        if (!(req_code_list[j] in req_data_topo_iter)) {
          req_data_topo_iter[req_code_list[j]] = {}
        }
        req_data_topo_iter[req_code_list[j]][data_code_list[k]] = 1
      }
    }

    let sol_list_iter = []
    for (let j = 0; j < data_iter["solution"].length; j++) {
      let code_iter = data_iter["solution"][j]
      if (code_iter["solution_category"] == "data_manipulation") {
        for (let k = 0; k < code_iter["componenet_code"].length; k++) {
          sol_list_iter.push(code_iter["componenet_code"][k])
        }
      } else {
        sol_list_iter.push(code_iter["componenet_code"])
      }
    }

    let last_sol_code = sol_list_iter[0]
    for (let j = 0; j < data_code_list.length; j++) {
      for (let k = 0; k < last_sol_code.length; k++) {
        if (!(last_sol_code[k] in data_sol_topo_iter)) {
          data_sol_topo_iter[data_code_list[j]] = {}
        }
        if (!(last_sol_code[k] in data_sol_topo_iter[data_code_list[j]])) {
          data_sol_topo_iter[data_code_list[j]][last_sol_code[k]] = 0
        }
        data_sol_topo_iter[data_code_list[j]][last_sol_code[k]] += 1

        if (data_code_list[j]["solution_category"] == "data_manipulation") {
        }
      }
    }

    for (let j = 1; j < sol_list_iter.length; j++) {
      for (let in_iter = 0; in_iter < sol_list_iter[j].length; in_iter++) {
        for (let out_iter = 0; out_iter < last_sol_code.length; out_iter++) {
          if (!(last_sol_code[out_iter] in sol_sol_topo_iter)) {
            sol_sol_topo_iter[last_sol_code[out_iter]] = {}
          }
          if (
            !(
              sol_list_iter[j][in_iter] in
              sol_sol_topo_iter[last_sol_code[out_iter]]
            )
          ) {
            sol_sol_topo_iter[last_sol_code[out_iter]][
              sol_list_iter[j][in_iter]
            ] = 0
          }
          sol_sol_topo_iter[last_sol_code[out_iter]][
            sol_list_iter[j][in_iter]
          ] += 1
        }
        for (let co_iter = 0; co_iter < sol_list_iter[j].length; co_iter++) {
          if (in_iter != co_iter) {
            if (!(sol_list_iter[j][in_iter] in sol_sol_co_iter)) {
              sol_sol_co_iter[sol_list_iter[j][in_iter]] = {}
            }
            if (
              !(
                sol_list_iter[j][in_iter] in
                sol_sol_co_iter[sol_list_iter[j][in_iter]]
              )
            ) {
              sol_sol_co_iter[sol_list_iter[j][in_iter]][
                sol_list_iter[j][co_iter]
              ] = 1
            } else {
              sol_sol_co_iter[sol_list_iter[j][in_iter]][
                sol_list_iter[j][co_iter]
              ] += 1
            }
          }
        }
        last_sol_code = sol_list_iter[j]
      }
    }
    factor = calcualte_link([
      req_data_topo_iter,
      data_sol_topo_iter,
      sol_sol_topo_iter
    ])

    req_data_topo_iter = topo_reparameter(req_data_topo_iter, 1 / factor)
    data_sol_topo_iter = topo_reparameter(data_sol_topo_iter, 1 / factor)
    sol_sol_topo_iter = topo_reparameter(sol_sol_topo_iter, 1 / factor)
    //sol_sol_co_iter = topo_reparameter(sol_sol_co_iter, 1 / factor)

    req_data_topo = topo_merge(req_data_topo, req_data_topo_iter)
    data_sol_topo = topo_merge(data_sol_topo, data_sol_topo_iter)
    sol_sol_topo = topo_merge(sol_sol_topo, sol_sol_topo_iter)
    sol_sol_co = topo_merge(sol_sol_co, sol_sol_co_iter)
  }
  return { req_data_topo, data_sol_topo, sol_sol_topo, sol_sol_co }
}

edge_building_requirement = (data, topo) => {
  let req_data_topo = req_data_empty_topo_building(topo)
  let data_sol_topo = data_sol_empty_topo_building(topo)
  let sol_sol_topo = sol_sol_empty_topo_building(topo)
  let sol_sol_co = sol_sol_empty_topo_building(topo)
  let last_requirement = ""

  let req_data_topo_req = req_data_empty_topo_building(topo)
  let data_sol_topo_req = data_sol_empty_topo_building(topo)
  let sol_sol_topo_req = sol_sol_empty_topo_building(topo)
  let sol_sol_co_req = sol_sol_empty_topo_building(topo)

  for (let i = 0; i < data.length; i++) {
    let data_iter = data[i]

    if (last_requirement != data_iter["requirement"]["requirement_text"]) {
      let factor = calcualte_link([
        req_data_topo_req,
        data_sol_topo_req,
        sol_sol_topo_req
        //sol_sol_co_req
      ])
      if (factor == 0) {
        factor = 1
      }
      req_data_topo_req = topo_reparameter(req_data_topo_req, 1 / factor)
      data_sol_topo_req = topo_reparameter(data_sol_topo_req, 1 / factor)
      sol_sol_topo_req = topo_reparameter(sol_sol_topo_req, 1 / factor)
      sol_sol_co_req = topo_reparameter(sol_sol_co_req, 1 / factor)

      req_data_topo = topo_merge(req_data_topo, req_data_topo_req)
      data_sol_topo = topo_merge(data_sol_topo, data_sol_topo_req)
      sol_sol_topo = topo_merge(sol_sol_topo, sol_sol_topo_req)
      sol_sol_co = topo_merge(sol_sol_co, sol_sol_co_req)

      req_data_topo_req = req_data_empty_topo_building(topo)
      data_sol_topo_req = data_sol_empty_topo_building(topo)
      sol_sol_topo_req = sol_sol_empty_topo_building(topo)
      sol_sol_co_req = sol_sol_empty_topo_building(topo)

      factor = 0
      last_title = data_iter["paper_title"]
    }

    let req_data_topo_iter = {}
    let data_sol_topo_iter = {}
    let sol_sol_topo_iter = {}
    let sol_sol_co_iter = {}
    let req_code_list = Object.keys(
      data_iter["requirement"]["requirement_code"]
    )
    let data_dict = data_iter["data"]["data_code"]
    let data_code_list = Object.keys(data_dict)

    for (let j = 0; j < req_code_list.length; j++) {
      req_data_topo_iter[req_code_list[j]] = {}
      for (let k = 0; k < data_code_list.length; k++) {
        //req_data_topo[req_code_list[j]][data_code_list[k]] +=data_dict[data_code_list[k]]
        if (!(req_code_list[j] in req_data_topo_iter)) {
          req_data_topo_iter[req_code_list[j]] = {}
        }
        req_data_topo_iter[req_code_list[j]][data_code_list[k]] = 1
      }
    }

    let sol_list_iter = []
    for (let j = 0; j < data_iter["solution"].length; j++) {
      let code_iter = data_iter["solution"][j]
      if (code_iter["solution_category"] == "data_manipulation") {
        for (let k = 0; k < code_iter["componenet_code"].length; k++) {
          sol_list_iter.push(code_iter["componenet_code"][k])
        }
      } else {
        sol_list_iter.push(code_iter["componenet_code"])
      }
    }

    let last_sol_code = sol_list_iter[0]
    for (let j = 0; j < data_code_list.length; j++) {
      for (let k = 0; k < last_sol_code.length; k++) {
        if (!(last_sol_code[k] in data_sol_topo_iter)) {
          data_sol_topo_iter[data_code_list[j]] = {}
        }
        if (!(last_sol_code[k] in data_sol_topo_iter[data_code_list[j]])) {
          data_sol_topo_iter[data_code_list[j]][last_sol_code[k]] = 0
        }
        data_sol_topo_iter[data_code_list[j]][last_sol_code[k]] += 1
      }
    }

    for (let j = 1; j < sol_list_iter.length; j++) {
      for (let in_iter = 0; in_iter < sol_list_iter[j].length; in_iter++) {
        for (let out_iter = 0; out_iter < last_sol_code.length; out_iter++) {
          if (!(last_sol_code[out_iter] in sol_sol_topo_iter)) {
            sol_sol_topo_iter[last_sol_code[out_iter]] = {}
          }
          if (
            !(
              sol_list_iter[j][in_iter] in
              sol_sol_topo_iter[last_sol_code[out_iter]]
            )
          ) {
            sol_sol_topo_iter[last_sol_code[out_iter]][
              sol_list_iter[j][in_iter]
            ] = 0
          }
          sol_sol_topo_iter[last_sol_code[out_iter]][
            sol_list_iter[j][in_iter]
          ] += 1
        }
        for (let co_iter = 0; co_iter < sol_list_iter[j].length; co_iter++) {
          if (in_iter != co_iter) {
            if (!(sol_list_iter[j][in_iter] in sol_sol_co_iter)) {
              sol_sol_co_iter[sol_list_iter[j][in_iter]] = {}
            }
            if (
              !(
                sol_list_iter[j][in_iter] in
                sol_sol_co_iter[sol_list_iter[j][in_iter]]
              )
            ) {
              sol_sol_co_iter[sol_list_iter[j][in_iter]][
                sol_list_iter[j][co_iter]
              ] = 1
            } else {
              sol_sol_co_iter[sol_list_iter[j][in_iter]][
                sol_list_iter[j][co_iter]
              ] += 1
            }
          }
        }
        last_sol_code = sol_list_iter[j]
      }
    }

    req_data_topo_req = topo_merge(req_data_topo_req, req_data_topo_iter)
    data_sol_topo_req = topo_merge(data_sol_topo_req, data_sol_topo_iter)
    sol_sol_topo_req = topo_merge(sol_sol_topo_req, sol_sol_topo_iter)
    sol_sol_co_req = topo_merge(sol_sol_co_req, sol_sol_co_iter)
  }

  let factor = calcualte_link([
    req_data_topo_req,
    data_sol_topo_req,
    sol_sol_topo_req
    //sol_sol_co_req
  ])
  if (factor == 0) {
    factor = 1
  }
  req_data_topo_req = topo_reparameter(req_data_topo_req, 1 / factor)
  data_sol_topo_req = topo_reparameter(data_sol_topo_req, 1 / factor)
  sol_sol_topo_req = topo_reparameter(sol_sol_topo_req, 1 / factor)
  sol_sol_co_req = topo_reparameter(sol_sol_co_req, 1 / factor)

  req_data_topo = topo_merge(req_data_topo, req_data_topo_req)
  data_sol_topo = topo_merge(data_sol_topo, data_sol_topo_req)
  sol_sol_topo = topo_merge(sol_sol_topo, sol_sol_topo_req)
  sol_sol_co = topo_merge(sol_sol_co, sol_sol_co_req)

  req_data_topo_req = req_data_empty_topo_building(topo)
  data_sol_topo_req = data_sol_empty_topo_building(topo)
  sol_sol_topo_req = sol_sol_empty_topo_building(topo)
  sol_sol_co_req = sol_sol_empty_topo_building(topo)
  return { req_data_topo, data_sol_topo, sol_sol_topo, sol_sol_co }
}

edge_building_paper = (data, topo) => {
  let req_data_topo = req_data_empty_topo_building(topo)
  let data_sol_topo = data_sol_empty_topo_building(topo)
  let sol_sol_topo = sol_sol_empty_topo_building(topo)
  let sol_sol_co = sol_sol_empty_topo_building(topo)
  let last_title = ""

  let req_data_topo_paper = req_data_empty_topo_building(topo)
  let data_sol_topo_paper = data_sol_empty_topo_building(topo)
  let sol_sol_topo_paper = sol_sol_empty_topo_building(topo)
  let sol_sol_co_paper = sol_sol_empty_topo_building(topo)

  for (let i = 0; i < data.length; i++) {
    let data_iter = data[i]

    if (last_title != data_iter["paper_title"]) {
      let factor = calcualte_link([
        req_data_topo_paper,
        data_sol_topo_paper,
        sol_sol_topo_paper
        //sol_sol_co_paper
      ])
      if (factor == 0) {
        factor = 1
      }
      req_data_topo_paper = topo_reparameter(req_data_topo_paper, 1 / factor)
      data_sol_topo_paper = topo_reparameter(data_sol_topo_paper, 1 / factor)
      sol_sol_topo_paper = topo_reparameter(sol_sol_topo_paper, 1 / factor)
      sol_sol_co_paper = topo_reparameter(sol_sol_co_paper, 1 / factor)

      req_data_topo = topo_merge(req_data_topo, req_data_topo_paper)
      data_sol_topo = topo_merge(data_sol_topo, data_sol_topo_paper)
      sol_sol_topo = topo_merge(sol_sol_topo, sol_sol_topo_paper)
      sol_sol_co = topo_merge(sol_sol_co, sol_sol_co_paper)

      req_data_topo_paper = req_data_empty_topo_building(topo)
      data_sol_topo_paper = data_sol_empty_topo_building(topo)
      sol_sol_topo_paper = sol_sol_empty_topo_building(topo)
      sol_sol_co_paper = sol_sol_empty_topo_building(topo)

      factor = 0
      last_title = data_iter["paper_title"]
    }

    let req_data_topo_iter = {}
    let data_sol_topo_iter = {}
    let sol_sol_topo_iter = {}
    let sol_sol_co_iter = {}
    let req_code_list = Object.keys(
      data_iter["requirement"]["requirement_code"]
    )
    let data_dict = data_iter["data"]["data_code"]
    let data_code_list = Object.keys(data_dict)

    for (let j = 0; j < req_code_list.length; j++) {
      req_data_topo_iter[req_code_list[j]] = {}
      for (let k = 0; k < data_code_list.length; k++) {
        //req_data_topo[req_code_list[j]][data_code_list[k]] +=data_dict[data_code_list[k]]
        if (!(req_code_list[j] in req_data_topo_iter)) {
          req_data_topo_iter[req_code_list[j]] = {}
        }
        req_data_topo_iter[req_code_list[j]][data_code_list[k]] = 1
      }
    }

    let sol_list_iter = []
    for (let j = 0; j < data_iter["solution"].length; j++) {
      let code_iter = data_iter["solution"][j]
      if (code_iter["solution_category"] == "data_manipulation") {
        for (let k = 0; k < code_iter["componenet_code"].length; k++) {
          sol_list_iter.push(code_iter["componenet_code"][k])
        }
      } else {
        sol_list_iter.push(code_iter["componenet_code"])
      }
    }

    let last_sol_code = sol_list_iter[0]
    for (let j = 0; j < data_code_list.length; j++) {
      for (let k = 0; k < last_sol_code.length; k++) {
        if (!(last_sol_code[k] in data_sol_topo_iter)) {
          data_sol_topo_iter[data_code_list[j]] = {}
        }
        if (!(last_sol_code[k] in data_sol_topo_iter[data_code_list[j]])) {
          data_sol_topo_iter[data_code_list[j]][last_sol_code[k]] = 0
        }
        data_sol_topo_iter[data_code_list[j]][last_sol_code[k]] += 1
      }
    }

    for (let j = 1; j < sol_list_iter.length; j++) {
      for (let in_iter = 0; in_iter < sol_list_iter[j].length; in_iter++) {
        for (let out_iter = 0; out_iter < last_sol_code.length; out_iter++) {
          if (!(last_sol_code[out_iter] in sol_sol_topo_iter)) {
            sol_sol_topo_iter[last_sol_code[out_iter]] = {}
          }
          if (
            !(
              sol_list_iter[j][in_iter] in
              sol_sol_topo_iter[last_sol_code[out_iter]]
            )
          ) {
            sol_sol_topo_iter[last_sol_code[out_iter]][
              sol_list_iter[j][in_iter]
            ] = 0
          }
          sol_sol_topo_iter[last_sol_code[out_iter]][
            sol_list_iter[j][in_iter]
          ] += 1
        }
        for (let co_iter = 0; co_iter < sol_list_iter[j].length; co_iter++) {
          if (in_iter != co_iter) {
            if (!(sol_list_iter[j][in_iter] in sol_sol_co_iter)) {
              sol_sol_co_iter[sol_list_iter[j][in_iter]] = {}
            }
            if (
              !(
                sol_list_iter[j][in_iter] in
                sol_sol_co_iter[sol_list_iter[j][in_iter]]
              )
            ) {
              sol_sol_co_iter[sol_list_iter[j][in_iter]][
                sol_list_iter[j][co_iter]
              ] = 1
            } else {
              sol_sol_co_iter[sol_list_iter[j][in_iter]][
                sol_list_iter[j][co_iter]
              ] += 1
            }
          }
        }
        last_sol_code = sol_list_iter[j]
      }
    }

    req_data_topo_paper = topo_merge(req_data_topo_paper, req_data_topo_iter)
    data_sol_topo_paper = topo_merge(data_sol_topo_paper, data_sol_topo_iter)
    sol_sol_topo_paper = topo_merge(sol_sol_topo_paper, sol_sol_topo_iter)
    sol_sol_co_paper = topo_merge(sol_sol_co_paper, sol_sol_co_iter)
  }

  let factor = calcualte_link([
    req_data_topo_paper,
    data_sol_topo_paper,
    sol_sol_topo_paper
    //sol_sol_co_paper
  ])
  if (factor == 0) {
    factor = 1
  }
  req_data_topo_paper = topo_reparameter(req_data_topo_paper, 1 / factor)
  data_sol_topo_paper = topo_reparameter(data_sol_topo_paper, 1 / factor)
  sol_sol_topo_paper = topo_reparameter(sol_sol_topo_paper, 1 / factor)
  sol_sol_co_paper = topo_reparameter(sol_sol_co_paper, 1 / factor)

  req_data_topo = topo_merge(req_data_topo, req_data_topo_paper)
  data_sol_topo = topo_merge(data_sol_topo, data_sol_topo_paper)
  sol_sol_topo = topo_merge(sol_sol_topo, sol_sol_topo_paper)
  sol_sol_co = topo_merge(sol_sol_co, sol_sol_co_paper)

  req_data_topo_paper = req_data_empty_topo_building(topo)
  data_sol_topo_paper = data_sol_empty_topo_building(topo)
  sol_sol_topo_paper = sol_sol_empty_topo_building(topo)
  sol_sol_co_paper = sol_sol_empty_topo_building(topo)

  return { req_data_topo, data_sol_topo, sol_sol_topo, sol_sol_co }
}

function tabAbout() {
  document.getElementById("about").style.display = "block"
  document.getElementById("explore").style.display = "none"
  document.getElementById("pattern").style.display = "none"
  document.getElementById("corpus").style.display = "none"
  document.getElementsByClassName("nav-link")[0].classList.remove("active")
  document.getElementsByClassName("nav-link")[1].classList.remove("active")
  document.getElementsByClassName("nav-link")[2].classList.remove("active")
  document.getElementsByClassName("nav-link")[3].classList.remove("active")
  document.getElementsByClassName("nav-link")[0].classList.add("active")
}
function tabExplore() {
  document.getElementById("about").style.display = "none"
  document.getElementById("explore").style.display = "block"
  document.getElementById("pattern").style.display = "none"
  document.getElementById("corpus").style.display = "none"
  document.getElementsByClassName("nav-link")[0].classList.remove("active")
  document.getElementsByClassName("nav-link")[1].classList.remove("active")
  document.getElementsByClassName("nav-link")[2].classList.remove("active")
  document.getElementsByClassName("nav-link")[3].classList.remove("active")
  document.getElementsByClassName("nav-link")[1].classList.add("active")
}
function tabPattern() {
  document.getElementById("about").style.display = "none"
  document.getElementById("explore").style.display = "none"
  document.getElementById("pattern").style.display = "block"
  document.getElementById("corpus").style.display = "none"
  document.getElementsByClassName("nav-link")[0].classList.remove("active")
  document.getElementsByClassName("nav-link")[1].classList.remove("active")
  document.getElementsByClassName("nav-link")[2].classList.remove("active")
  document.getElementsByClassName("nav-link")[3].classList.remove("active")
  document.getElementsByClassName("nav-link")[2].classList.add("active")
}
function tabCorpus() {
  document.getElementById("about").style.display = "none"
  document.getElementById("explore").style.display = "none"
  document.getElementById("pattern").style.display = "none"
  document.getElementById("corpus").style.display = "block"
  //document.getElementsByClassName("nav-link").setAttribute("class", "nav-link");
  document.getElementsByClassName("nav-link")[0].classList.remove("active")
  document.getElementsByClassName("nav-link")[1].classList.remove("active")
  document.getElementsByClassName("nav-link")[2].classList.remove("active")
  document.getElementsByClassName("nav-link")[3].classList.remove("active")
  document.getElementsByClassName("nav-link")[3].classList.add("active")

  Promise.all([
    d3.json("./static/data.json"),
    d3.json("./static/requirement_topo.json"),
    d3.json("./static/data_topo.json"),
    d3.json("./static/sol_topo.json")
  ]).then(([data, req_topo, data_topo, sol_topo]) => {
    let topo_combina = topo_building(req_topo, data_topo, sol_topo)
    console.log(topo_combina)
    console.log(data)
    let topo = edge_building_unbalance(data, topo_combina)
    let req_data_list = dict2list(topo.req_data_topo)
    let data_sol_list = dict2list(topo.data_sol_topo)
    let sol_sol_list = dict2list(topo.sol_sol_topo)
    console.log(topo)
    console.log("req_data_list")
    console.log(req_data_list)
    console.log("data_sol_list")
    console.log(data_sol_list)
    console.log("sol_sol_list")
    console.log(sol_sol_list)
    let all_all_list = [...req_data_list, ...data_sol_list, ...sol_sol_list]
    all_all_list = d3.filter(all_all_list, (d) => d.weight != 0)
    console.log(all_all_list)
    let scale_set = scale_set_create(topo_combina)
    let main_svg = d3.select("#corpus").append("svg")
    let width = 1000
    let height = 1000
    main_svg
      .attr("width", width)
      .attr("height", height)
      .attr("width", width)
      .attr("height", height)
    /*     main_svg
      .selectAll("circle")
      .data(req_data_list)
      .join("circle")
      .attr("cx", (d) => scale_set.req(d.out_key) * 20 + 20)
      .attr("cy", (d) => scale_set.data(d.in_key) * 20 + 20)
      .attr("fill", "red ")
      .attr("r", 5)
      .attr("opacity", (d) => d.weight / 10) */
    let node_list = topo_combina.all_list.map((d) => ({ ...d }))
    let simulation = (d3.simulation = d3
      .forceSimulation()
      .nodes(node_list)
      .force(
        "link",
        d3.forceLink(all_all_list).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("x", d3.forceX())
      .force("y", d3.forceY())).force(
      "center",
      d3.forceCenter(width / 2, height / 2)
    )
    //console.log(node_list)
    const link = main_svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(all_all_list)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.weight))

    const node = main_svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(node_list)
      .join("circle")
      .attr("r", 5)
      .attr("fill", (d) => scale_set.color_type(d.group))

    // Add a drag behavior.
    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)
    })

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }
  })
}

dict2list = (dict) => {
  let list = []
  let out_key_list = Object.keys(dict)
  for (
    let out_key_index = 0;
    out_key_index < out_key_list.length;
    out_key_index++
  ) {
    let in_key_list = Object.keys(dict[out_key_list[out_key_index]])
    for (
      let in_key_index = 0;
      in_key_index < in_key_list.length;
      in_key_index++
    ) {
      list.push({
        source: out_key_list[out_key_index],
        target: in_key_list[in_key_index],
        weight: dict[out_key_list[out_key_index]][in_key_list[in_key_index]]
      })
    }
  }
  return list
}

scale_set_create = (topo_combina) => {
  let scale_set = {}
  scale_set["req"] = d3
    .scaleOrdinal()
    .domain(topo_combina.req_list)
    .range(Array.from(Array(topo_combina.req_list.length - 1).keys()))
  scale_set["data"] = d3
    .scaleOrdinal()
    .domain(topo_combina.data_list)
    .range(Array.from(Array(topo_combina.data_list.length - 1).keys()))
  scale_set["sol"] = d3
    .scaleOrdinal()
    .domain(topo_combina.sol_list)
    .range(Array.from(Array(topo_combina.sol_list.length - 1).keys()))
  scale_set["color_type"] = d3
    .scaleOrdinal()
    .domain([1, 2, 3])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"])
  return scale_set
}