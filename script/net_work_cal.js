let filter_list = []

init_edge = (id, node, scale_set) => {
  node
    .attr("class", (d) => create_class_edge(id, d))
    .attr("id", (d) => `Topo_line_${d.source.id}_${d.target.id}`)
    .attr("stroke", link_color)
    .attr("stroke-width", (d) => Math.sqrt(d.weight))
    .attr("fill", "none")
    .attr("isCalled", "false")
    .attr("d", (d) => link_path(d))
    .attr("opacity", 0.4)
    .attr("marker-end", (d) => {
      if (d.is_directional == 1) {
        return `url(${new URL(
          `#Topo_arrow_${d.source.id}_${d.target.id}`,
          location
        )})`
      } else {
      }
    })
    .on("mouseover", (event, d) => {
      add_tool_tip(id, d, event.clientX, event.clientY, "link")
    })
    .on("mouseout", (event, d) => {
      d3.select("#corpus").select("#custom_tooltip").remove()
    })
}

init_node = (id, node, scale_set, simulation) => {
  node
    .attr("d", (d) => path_form(d.group, 100))
    .attr("fill", (d) => scale_set.color_node_type(d.group))
    .attr("class", (d) => `node node_${d.id}`)
    .attr("stroke", "white")
    .attr("stroke-width", 2)

  node.call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  )

  // Set the position attributes of links and nodes each time the simulation ticks.

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
}

init_marker = (id, node, scale_set) => {
  node
    .append("marker")
    .attr("id", (d) => `Topo_arrow_${d.source.id}_${d.target.id}`)
    .attr(
      "class",
      (d) => `Topo_arrow_strat_${d.source.id} Topo_arrow_end_${d.target.id}`
    )
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -0.5)
    .attr("markerWidth", 4)
    .attr("markerHeight", 5)
    .attr("fill", (d) => "#999")
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
}

upd_link_and_node_and_marker = (
  filter_list,
  link_set,
  node_set,
  marker_set
) => {
  link_set.selectAll("path").attr("stroke-width", (d) => Math.sqrt(d.weight))
  let requirement_code_list = d3.filter(
    filter_list,
    (d) => d.type == "requirement"
  )
  requirement_code_list = d3.map(requirement_code_list, (d) => d.key_word_list)
  requirement_code_list = requirement_code_list.flat()
  let data_code_list = d3.filter(filter_list, (d) => d.type == "data")
  data_code_list = d3.map(data_code_list, (d) => d.key_word_list)
  data_code_list = data_code_list.flat()
  requirement_code_list.forEach((req) => {
    data_code_list.forEach((data) => {
      link_set
        .select(`.Topo_arrow_${req}_${data}`)
        .attr("opacity", 1)
        .attr("stroke", "red")
    })
  })
  let source_node = ""
  filter_list.forEach((d) => {
    d.key_word_list.forEach((k) => {
      node_set.select(`.node_${k}`).attr("d", (d) => path_form(d.group, 400))
      if (d.type == "solution") {
        if (source_node == "") {
          data_code_list.forEach((data) => {
            link_set
              .select(`.Topo_arrow_${data}_${k}`)
              .attr("opacity", 1)
              .attr("stroke", "red")
          })
        }
        link_set
          .select(`.Topo_arrow_${source_node}_${k}`)
          .attr("opacity", 1)
          .attr("stroke", "red")
      }
      source_node = k
    })
  })
}

create_class_edge = (id, d) => {
  switch (id) {
    case "#corpus":
      return d.is_directional
        ? `lines Topo_line_target_${d.target.id} Topo_line_source_${d.source.id} Topo_arrow_${d.source.id}_${d.target.id}`
        : `lines Topo_line_target_${d.target.id} Topo_line_source_${d.source.id} Topo_co_${d.source.id}_${d.target.id} Topo_co_${d.target.id}_${d.source.id}`
    case "#pattern":
      return d.is_directional
        ? `lines Topo_line_target_${d.target} Topo_line_source_${d.source} Topo_arrow_${d.source}_${d.target}`
        : `lines Topo_line_target_${d.target} Topo_line_source_${d.source} Topo_co_${d.source}_${d.target} Topo_co_${d.target}_${d.source}`
  }
}

/*

*/
add_tool_tip = (id, d, x, y, type) => {
  d3.select(id).select("#custom_tooltip").remove()
  d3.select(id)
    .append("div")
    .attr("id", "custom_tooltip")
    .attr("class", "custom_tooltip bg-violet")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .html(tooltip_html(id, d, type))
    .style("left", x + 70 + "px")
    .style("top", y + "px")
}

tooltip_html = (id, d, type) => {
  switch (type) {
    case "node":
      return `Type: ${d.id}`
      break
    case "link":
      switch (id) {
        case "#corpus":
          return `This link is from ${d.source.id} to ${d.target.id} <br/> Weight: ${d.weight}`
        case "#pattern":
          return `This link is from ${d.source} to ${d.target} <br/> Weight: ${d.weight}`
      }

      break
    default:
      break
  }
}
path_form = (type, size) => {
  switch (type) {
    case 1:
      return d3
        .symbol()
        .type(d3.symbolSquare)
        .size(size + 40)()
      break
    case 2:
      return d3.symbol().type(d3.symbolTriangle).size(size)()
      break
    case 3:
      return d3
        .symbol()
        .type(d3.symbolCircle)
        .size(size + 40)()
      break
    default:
      break
  }
}

link_color = (d) => {
  if (d.is_directional == 1) {
    return "grey"
  } else {
    return "black"
  }
}

set_connection_edge = (node) => {}
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

topo_merge_co = (topo_main, topo_iter) => {
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

      topo_main[out_key][in_key].value += topo_iter[out_key][in_key].value

      let pattern_key_list = Array.from(
        new Set([
          ...Object.keys(topo_iter[out_key][in_key].pattern),
          ...Object.keys(topo_main[out_key][in_key].pattern)
        ])
      )
      /* The code is checking if the length of the `pattern_key_list` array is greater than 0. If it is, then
it will log the contents of the `pattern_key_list` array to the console. */

      for (
        let pattern_key_index = 0;
        pattern_key_index < pattern_key_list.length;
        pattern_key_index++
      ) {
        let pattern_key = pattern_key_list[pattern_key_index]
        if (!(pattern_key in topo_main[out_key][in_key].pattern)) {
          topo_main[out_key][in_key].pattern[pattern_key] = 0
        }
        if (!(pattern_key in topo_iter[out_key][in_key].pattern)) {
          topo_iter[out_key][in_key].pattern[pattern_key] = 0
        }

        topo_main[out_key][in_key].pattern[pattern_key] +=
          topo_iter[out_key][in_key].pattern[pattern_key]
      }
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
  let req_data_topo = new Object()
  for (let i = 0; i < topo.req_list.length; i++) {
    req_data_topo[topo.req_list[i]] = {}
    for (let j = 0; j < topo.data_list.length; j++) {
      req_data_topo[topo.req_list[i]][topo.data_list[j]] = 0
    }
  }

  return req_data_topo
}

data_sol_empty_topo_building = (topo) => {
  let data_sol_topo = new Object()
  for (let i = 0; i < topo.data_list.length; i++) {
    data_sol_topo[topo.data_list[i]] = {}
    for (let j = 0; j < topo.sol_list.length; j++) {
      data_sol_topo[topo.data_list[i]][topo.sol_list[j]] = 0
    }
  }
  return data_sol_topo
}
sol_sol_empty_topo_building = (topo) => {
  let sol_sol_topo = new Object()
  for (let i = 0; i < topo.sol_list.length; i++) {
    sol_sol_topo[topo.sol_list[i]] = {}
    for (let j = 0; j < topo.sol_list.length; j++) {
      sol_sol_topo[topo.sol_list[i]][topo.sol_list[j]] = 0
    }
  }
  return sol_sol_topo
}

sol_sol_empty_topo_building_co = (topo) => {
  let sol_sol_topo = new Object()
  for (let i = 0; i < topo.sol_list.length; i++) {
    sol_sol_topo[topo.sol_list[i]] = {}
    for (let j = 0; j < topo.sol_list.length; j++) {
      sol_sol_topo[topo.sol_list[i]][topo.sol_list[j]] = {
        value: 0,
        pattern: {}
      }
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

/*

filter_list should be composed by a list of dict
dict should be like
{
  type:"interaction",
  key_word_list:['xx'],
  is_exclude:false,
  is_pure:false
}

*/
data_process = (data_original, filter_list = []) => {
  let data = data_original

  filter_list.forEach((filter_iter) => {
    if (filter_iter.type == "requirement") {
      data = data_filter_req(
        data,
        filter_iter.key_word_list,
        filter_iter.is_exclude,
        filter_iter.is_pure
      )
    } else if (filter_iter.type == "data") {
      data = data_filter_data(
        data,
        filter_iter.key_word_list,
        filter_iter.is_exclude,
        filter_iter.is_pure
      )
    } else {
      data = data_filter_sol(
        data,
        filter_iter.key_word_list,
        filter_iter.is_exclude,
        filter_iter.is_pure,
        filter_iter.position
      )
    }
  })
  console.log("data_after_process")
  console.log(data)
  console.log("filter_list")
  console.log(filter_list)
  return data
}

upd_all_all_list = (
  data_original,
  topo_combination,
  filter_dict = [],
  is_filter_zero_weight_link = true
) => {
  let data = data_process(data_original, filter_dict)
  let topo = edge_building_matrix_paper(data, topo_combination)

  return link_building(topo, is_filter_zero_weight_link)
}

link_building = (topo, is_filter_zero_weight_link = true) => {
  let req_data_list = dict2list(topo.req_data_topo)
  let data_sol_list = dict2list(topo.data_sol_topo)
  let sol_sol_list = dict2list(topo.sol_sol_topo)
  let sol_sol_co_list = dict2list_co(topo.sol_sol_co)

  let all_all_list = [...req_data_list, ...data_sol_list, ...sol_sol_list]
  all_all_list.forEach((d) => (d["is_directional"] = 1))
  sol_sol_co_list.forEach((d) => (d["is_directional"] = 0))
  all_all_list = [...all_all_list, ...sol_sol_co_list]
  if (is_filter_zero_weight_link) {
    all_all_list = d3.filter(all_all_list, (d) => d.weight != 0)
  }

  return all_all_list
}

link_complement = (all_all_list, topo_structure_list) => {
  let topo_structure_list_id = topo_structure_list.map((d) => d.id)

  for (let i = 0; i < topo_structure_list_id.length; i++) {
    for (let j = 0; j < topo_structure_list_id.length; j++) {
      if (
        d3.filter(
          all_all_list,
          (d) =>
            d.source == topo_structure_list_id[i] &&
            d.target == topo_structure_list_id[j]
        ) == 0
      ) {
        all_all_list.push({
          source: topo_structure_list_id[i],
          target: topo_structure_list_id[j],
          weight: 0,
          is_directional: 1
        })
      }
    }
  }

  return all_all_list
}

calculate_matrix_paper = (
  topo,
  req_data_paper,
  data_sol_paper,
  sol_sol_paper,
  req_paper,
  data_paper,
  sol_paper
) => {
  let req_data_topo = req_data_empty_topo_building(topo)
  let data_sol_topo = data_sol_empty_topo_building(topo)
  let sol_sol_topo = sol_sol_empty_topo_building(topo)
  let sol_sol_co = sol_sol_empty_topo_building_co(topo)

  let sol_list = new Set()
  for (const [key_req, key_data_set] of Object.entries(req_data_paper)) {
    key_data_set.forEach((key_data) => {
      req_paper[key_req].forEach((req_cat) => {
        data_paper[key_data].forEach((data_cat) => {
          req_data_topo[req_cat][data_cat] += 1
        })
      })
    })
  }
  for (const [key_data, key_sol_set] of Object.entries(data_sol_paper)) {
    key_sol_set.forEach((key_sol) => {
      sol_list.add(key_sol)
      data_paper[key_data].forEach((data_cat) => {
        if (key_sol.substring(0, 4) != "data") {
          sol_paper[key_sol].solution_code.forEach((sol_cat) => {
            data_sol_topo[data_cat][sol_cat] += 1
          })
        } else {
          data_sol_topo[data_cat][sol_paper[key_sol].solution_code[0]] += 1
          sol_paper[key_sol].solution_code.forEach(
            (sol_cat, index, sol_path) => {
              if (index == 0) {
                return
              } else {
                //sol_sol_topo[sol_path[index - 1]][sol_cat] += 1
              }
            }
          )
        }
      })
    })
  }

  for (const [key_pre_sol, key_post_sol_set] of Object.entries(sol_sol_paper)) {
    let key_pre_sol_cat_list = sol_paper[key_pre_sol].solution_code
    if (key_pre_sol.substring(0, 4) == "data") {
      key_pre_sol_cat_list = key_pre_sol_cat_list.slice(-1)
    }
    sol_list.add(key_pre_sol)
    key_pre_sol_cat_list.forEach((pre_sol_cat) => {
      key_post_sol_set.forEach((key_post_sol) => {
        sol_list.add(key_post_sol)
        if (key_post_sol.substring(0, 4) == "data") {
          sol_sol_topo[pre_sol_cat][
            sol_paper[key_post_sol].solution_code[0]
          ] += 1
          sol_paper[key_post_sol].solution_code.forEach(
            (sol_cat, index, sol_path) => {
              if (index == 0) {
                return
              } else {
                // sol_sol_topo[sol_path[index - 1]][sol_cat] += 1
              }
            }
          )
        } else {
          sol_paper[key_post_sol].solution_code.forEach((post_sol_cat) => {
            sol_sol_topo[pre_sol_cat][post_sol_cat] += 1
          })
        }
      })
    })
  }

  sol_list.forEach((key_sol) => {
    if (key_sol.substring(0, 4) == "data") {
      sol_paper[key_sol].solution_code.forEach((sol_cat, index, sol_path) => {
        if (index == 0) {
          return
        } else {
          sol_sol_topo[sol_path[index - 1]][sol_cat] += 1
        }
      })
      return
    }
    let sol_cat_list = new Set(sol_paper[key_sol].solution_code)
    let sol_axial = sol_paper[key_sol].solution_axial
    sol_cat_list.forEach((pre_key, pre_index, arr) => {
      arr.forEach((post_key, post_index, arr) => {
        if (pre_index == post_index) {
          return
        }

        sol_sol_co[pre_key][post_key].value += 1

        if (key_sol.substring(0, 4) == "visu") {
          if (!(sol_axial in sol_sol_co[pre_key][post_key].pattern)) {
            sol_sol_co[pre_key][post_key].pattern[sol_axial] = 0
          }
          sol_sol_co[pre_key][post_key].pattern[sol_axial] += 1
        }
      })
    })
  })

  return {
    req_data_topo,
    data_sol_topo,
    sol_sol_topo,
    sol_sol_co
  }
}

edge_building_matrix_paper = (data, topo) => {
  let last_title = ""
  let req_data_topo = req_data_empty_topo_building(topo)
  let data_sol_topo = data_sol_empty_topo_building(topo)
  let sol_sol_topo = sol_sol_empty_topo_building(topo)

  let sol_sol_co = sol_sol_empty_topo_building_co(topo)
  let req_data_paper = {}
  let data_sol_paper = {}
  let sol_sol_paper = {}
  let req_paper = {}
  let data_paper = {}
  let sol_paper = {}
  data = structuredClone(data)
  for (let index = 0; index < data.length; index++) {
    let data_iter = data[index]
    if (last_title != data_iter.paper_title) {
      // Deal with combine

      let a = calculate_matrix_paper(
        topo,
        req_data_paper,
        data_sol_paper,
        sol_sol_paper,
        req_paper,
        data_paper,
        sol_paper
      )

      req_data_topo = topo_merge(req_data_topo, a.req_data_topo)
      data_sol_topo = topo_merge(data_sol_topo, a.data_sol_topo)
      sol_sol_topo = topo_merge(sol_sol_topo, a.sol_sol_topo)
      sol_sol_co = topo_merge_co(sol_sol_co, a.sol_sol_co)
      req_data_paper = {}
      data_sol_paper = {}
      sol_sol_paper = {}
      req_paper = {}
      data_paper = {}
      sol_paper = {}
      last_title = data_iter.paper_title
    }

    let req_node = data_iter.requirement
    req_node.requirement_code = Object.keys(req_node.requirement_code)
    if (!(req_node.requirement_text in req_paper)) {
      req_paper[req_node.requirement_text] = req_node.requirement_code
    }
    let data_node = data_iter.data
    data_node.data_code = new Set(Object.keys(data_node.data_code))
    if (!(data_node.data_text in data_paper)) {
      data_paper[data_node.data_text] = new Set([...data_node.data_code])
    }
    data_paper[data_node.data_text] = new Set([
      ...data_node.data_code,
      ...data_paper[data_node.data_text]
    ])

    if (!(req_node.requirement_text in req_data_paper)) {
      req_data_paper[req_node.requirement_text] = new Set()
    }

    req_data_paper[req_node.requirement_text].add(data_node.data_text)
    for (let i = 0; i < data_iter.solution.length; i++) {
      let solution_node = {}

      solution_node["solution_text"] =
        data_iter.solution[i].solution_category +
        data_iter.solution[i].solution_text
      solution_node["solution_code"] = data_iter.solution[i].componenet_code
      solution_node["solution_axial"] = data_iter.solution[i].solution_axial
      sol_paper[solution_node.solution_text] = {
        solution_code: solution_node.solution_code,
        solution_axial: solution_node.solution_axial
      }
    }

    for (let i = 0; i < data_iter.solution.length; i++) {
      if (i == 0) {
        if (!(data_iter.data.data_text in data_sol_paper)) {
          data_sol_paper[data_iter.data.data_text] = new Set()
        }
        data_sol_paper[data_iter.data.data_text].add(
          data_iter.solution[i].solution_category +
            data_iter.solution[i].solution_text
        )
      } else {
        if (
          !(
            data_iter.solution[i - 1].solution_category +
              data_iter.solution[i - 1].solution_text in
            sol_sol_paper
          )
        ) {
          sol_sol_paper[
            data_iter.solution[i - 1].solution_category +
              data_iter.solution[i - 1].solution_text
          ] = new Set()
        }
        sol_sol_paper[
          data_iter.solution[i - 1].solution_category +
            data_iter.solution[i - 1].solution_text
        ].add(
          data_iter.solution[i].solution_category +
            data_iter.solution[i].solution_text
        )
      }
    }
  }

  let a = calculate_matrix_paper(
    topo,
    req_data_paper,
    data_sol_paper,
    sol_sol_paper,
    req_paper,
    data_paper,
    sol_paper
  )

  req_data_topo = topo_merge(req_data_topo, a.req_data_topo)
  data_sol_topo = topo_merge(data_sol_topo, a.data_sol_topo)
  sol_sol_topo = topo_merge(sol_sol_topo, a.sol_sol_topo)
  sol_sol_co = topo_merge_co(sol_sol_co, a.sol_sol_co)

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

  Promise.all([
    d3.json("./static/data.json"),
    d3.json("./static/requirement_topo.json"),
    d3.json("./static/data_topo.json"),
    d3.json("./static/sol_topo.json")
  ]).then(([data_original, req_topo, data_topo, sol_topo]) => {
    let topo_combination = topo_building(req_topo, data_topo, sol_topo)

    let all_all_list = upd_all_all_list(
      data_original,
      topo_combination,
      [],
      (is_filter_zero_weight_link = false)
    )
    //all_all_list = d3.filter(all_all_list, (d) => d.source == d.target)
    let node_list = topo_combination.all_list.map((d) => ({ ...d }))

    all_all_list = d3.filter(all_all_list, (d) => d.is_directional == 1)
    all_all_list = link_complement(all_all_list, topo_combination.all_list)

    node_list_reorder = d3.map(node_list, (d, index) => {
      return { name: d.id, weight: +0, index: +index }
    })
    all_all_list_reorder = d3.map(all_all_list, (original, index) => {
      return {
        source: d3.filter(
          node_list_reorder,
          (d) => d.name == original.source
        )[0], //{ name: d.source, weight: +0 },
        target: d3.filter(
          node_list_reorder,
          (d) => d.name == original.target
        )[0],
        value: original.weight,
        index: +index,
        distance: +0
      }
    })

    var graph = reorder
      .graph()
      .nodes(node_list_reorder)
      .links(all_all_list_reorder)
      .init()
    let dist_adjacency
    const leafOrder = reorder
      .optimal_leaf_order()
      .distance(reorder.distance["manhattan"])
    function computeLeaforder() {
      const adjacency = reorder.graph2mat(graph)
      return leafOrder(adjacency)
    }
    function computeRCM() {
      return reorder.reverse_cuthill_mckee_order(graph)
    }
    let new_order = computeLeaforder()
    new_order = Array.from(Array(topo_combination.all_list.length - 1).keys())
    let scale_set = scale_set_create(topo_combination, all_all_list)
    let scale_opacity = d3.scaleLog(
      d3.extent(all_all_list, (d) => d.weight + 1),
      [0, 1]
    )

    let main_svg = d3.select("#pattern").append("svg")
    let width = 1000
    let height = 1000
    main_svg
      .attr("width", width)
      .attr("height", height)
      .attr("width", width)
      .attr("height", height)

    main_svg
      .append("g")
      .attr("class", "matrix_1")
      .selectAll("rect")
      .data(all_all_list)
      .join("rect")
      .attr("x", (d) => new_order[scale_set.all_ordinal(d.target)] * 10 + 1)
      .attr("y", (d) => new_order[scale_set.all_ordinal(d.source)] * 10 + 1)
      .attr("id", (d) => `rect_${d.source}_${d.target}`)
      .attr("width", 8)
      .attr("height", 8)
      .attr("fill", "red")
      .attr("opacity", (d) => scale_opacity(+d.weight + 1))
      .attr("stroke", "grey")
      .on("mouseover", (event, d) => {
        d3.select(`#rect_${d.source}_${d.target}`).attr("fill", "blue")
        add_tool_tip("#pattern", d, event.clientX, event.clientY, "link")
      })
      .on("mouseout", (event, d) => {
        d3.select("#pattern").select("#custom_tooltip").remove()
      })
  })
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
  ]).then(([data_original, req_topo, data_topo, sol_topo]) => {
    d3.select("#corpus").select("svg").remove()
    let draw_force = (
      data_original,
      req_topo,
      data_topo,
      sol_topo,
      filter_list = []
    ) => {
      let topo_combination = topo_building(req_topo, data_topo, sol_topo)

      let all_all_list = upd_all_all_list(
        data_original,
        topo_combination,
        filter_list
      )

      //all_all_list = d3.filter(all_all_list, (d) => d.source == d.target)
      let node_list = topo_combination.all_list.map((d) => ({ ...d }))
      let scale_set = scale_set_create(topo_combination, all_all_list)

      let main_svg = d3.select("#corpus").append("svg")
      let width = 1000
      let height = 1000
      main_svg
        .attr("width", width)
        .attr("height", height)
        .attr("width", width)
        .attr("height", height)

      let simulation = d3
        .forceSimulation()
        .nodes(node_list)
        .force(
          "link",
          d3.forceLink(all_all_list).id((d) => d.id)
        )
        .force("charge", d3.forceManyBody().strength(-800))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter(width / 2, height / 2))

      const link = main_svg
        .append("g")
        .attr("class", "links")
        .selectAll("path")
        .data(
          all_all_list,
          (d) => `${d.source.id}_${d.target.id}_${d.is_directional}`
        )
        .join("path")
      /*       .attr(
        "class",
        (d) =>
          `lines Topo_line_target_${d.target.id} Topo_line_source_${d.source.id}`
      )
      .attr("id", (d) => `Topo_line_${d.source.id}_${d.target.id}`)
      .attr("stroke", link_color)
      .attr("stroke-width", (d) => Math.sqrt(d.weight))
      .attr("fill", "none")
      .attr("isCalled", "false")
      .attr("d", (d) => linkArc(d))
      .attr("marker-end", (d) => {
        if (d.is_directional == 1) {
          return `url(${new URL(
            `#Topo_arrow_${d.source.id}_${d.target.id}`,
            location
          )})`
        } else {
        }
      }) */
      init_edge("#corpus", link, scale_set)
      let marker = main_svg
        .append("g")
        .attr("class", "markers")
        .selectAll("defs")
        .data(all_all_list)
        .join("defs")
      init_marker("#corpus", marker, scale_set)

      const node = main_svg
        .append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(node_list, (d) => d.id)
        .join("path")

      init_node("#corpus", node, scale_set, simulation)
      simulation.on("tick", () => {
        link.attr("d", link_path)

        node.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
      })

      node
        .on("click", (event, d) => {
          if (req_topo.indexOf(d.id) != -1) {
            filter_list.push({
              type: "requirement",
              key_word_list: [d.id],
              is_exclude: false,
              is_pure: false
            })
          } else if (
            data_topo.dataset.indexOf(d.id) != -1 ||
            data_topo.category.indexOf(d.id) != -1 ||
            data_topo.direction.indexOf(d.id) != -1
          ) {
            filter_list.push({
              type: "data",
              key_word_list: [d.id],
              is_exclude: false,
              is_pure: false
            })
          } else {
            filter_list.push({
              type: "solution",
              key_word_list: [d.id],
              is_exclude: false,
              is_pure: false,
              position: d3.filter(filter_list, (d) => d.type == "solution")
                .length
            })
          }
          upd_force(
            data_original,
            req_topo,
            data_topo,
            sol_topo,
            filter_list,
            simulation
          )
        })
        .on("mouseover", (event, d) => {
          add_tool_tip("#corpus", d, event.clientX, event.clientY, "node")
        })
        .on("mouseout", (event, d) => {
          d3.select("#corpus").select("#custom_tooltip").remove()
        })
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )
      // Add a drag behavior.
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
    }

    let upd_force = (
      data_original,
      req_topo,
      data_topo,
      sol_topo,
      filter_list = [],
      simulation
    ) => {
      let topo_combination = topo_building(req_topo, data_topo, sol_topo)

      let all_all_list = upd_all_all_list(
        data_original,
        topo_combination,
        filter_list
      )

      //all_all_list = d3.filter(all_all_list, (d) => d.source == d.target)
      let node_list = topo_combination.all_list.map((d) => ({ ...d }))
      let scale_set = scale_set_create(topo_combination, all_all_list)

      let main_svg = d3.select("#corpus").select("svg")
      simulation.nodes(node_list).force(
        "link",
        d3.forceLink(all_all_list).id((d) => d.id)
      )

      const link_set = main_svg.selectAll(".links")
      let link = link_set
        .selectAll("path")
        .data(
          all_all_list,
          (d) => `${d.source.id}_${d.target.id}_${d.is_directional}`
        )
        .join("path")
        .attr("stroke", link_color)
        .attr("stroke-width", (d) => Math.sqrt(d.weight))
        .attr("fill", "none")
        .attr("isCalled", "false")
        .attr("d", (d) => link_path(d))
        .attr("opacity", 0.3)
        .attr("class", (d) => create_class_edge("corpus", d))
        .attr("id", (d) => `Topo_line_${d.source.id}_${d.target.id}`)

      //.join("defs")
      let marker_set = main_svg.select(".markers")
      //init_marker("#corpus", marker, scale_set)
      const node_set = main_svg.select(".nodes")
      let node = node_set
        .selectAll(".node")
        .data(node_list, (d) => d.id)
        .join("path")
        .attr("d", (d) => path_form(d.group, 100))
        .attr("fill", (d) => scale_set.color_node_type(d.group))
        .attr("class", (d) => `node node_${d.id}`)
        .on("mouseover", (event, d) => {
          add_tool_tip("#corpus", d, event.clientX, event.clientY, "node")
        })
        .on("mouseout", (event, d) => {
          d3.select("#corpus").select("#custom_tooltip").remove()
        })
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )
      init_edge("#corpus", link, scale_set)
      init_node("#corpus", node, scale_set, simulation)
      upd_link_and_node_and_marker(filter_list, link, node, marker_set)
      // Set the position attributes of links and nodes each time the simulation ticks.
      simulation.on("tick", () => {
        link.attr("d", link_path)

        node.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
      })
      // Reheat the simulation when drag starts, and fix the subject position.

      //init_node("#corpus", node.selectAll(".node"), scale_set, simulation)
      node

        .on("click", (event, d) => {
          if (req_topo.indexOf(d.id) != -1) {
            filter_list.push({
              type: "requirement",
              key_word_list: [d.id],
              is_exclude: false,
              is_pure: false
            })
          } else if (
            data_topo.dataset.indexOf(d.id) != -1 ||
            data_topo.category.indexOf(d.id) != -1 ||
            data_topo.direction.indexOf(d.id) != -1
          ) {
            filter_list.push({
              type: "data",
              key_word_list: [d.id],
              is_exclude: false,
              is_pure: false
            })
          } else {
            filter_list.push({
              type: "solution",
              key_word_list: [d.id],
              is_exclude: false,
              is_pure: false,
              position: d3.filter(filter_list, (d) => d.type == "solution")
                .length
            })
          }
          upd_force(
            data_original,
            req_topo,
            data_topo,
            sol_topo,
            filter_list,
            simulation
          )
        })
        .on("mouseover", (event, d) => {
          add_tool_tip("#corpus", d, event.clientX, event.clientY, "node")
        })
        .on("mouseout", (event, d) => {
          d3.select("#corpus").select("#custom_tooltip").remove()
        })

      node.call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      d3.select("#withdraw_button").on("click", () => {
        filter_list_w = filter_list.slice(0, -1)
        upd_force(
          data_original,
          req_topo,
          data_topo,
          sol_topo,
          filter_list_w,
          simulation
        )
      })
      upd_link_and_node_and_marker(filter_list, link_set, node_set, marker_set)
      // Add a drag behavior.
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
    }

    draw_force(data_original, req_topo, data_topo, sol_topo, [])
    d3.select("#corpus")
      .select("svg")
      .append("g")
      .append("rect")
      .attr("id", "withdraw_button")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "red")
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

dict2list_co = (dict) => {
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
        weight:
          dict[out_key_list[out_key_index]][in_key_list[in_key_index]].value,
        pattern:
          dict[out_key_list[out_key_index]][in_key_list[in_key_index]].pattern
      })
    }
  }
  return list
}

scale_set_create = (topo_combination, all_all_list) => {
  let scale_set = {}
  scale_set["req"] = d3
    .scaleOrdinal()
    .domain(topo_combination.req_list)
    .range(Array.from(Array(topo_combination.req_list.length - 1).keys()))
  scale_set["data"] = d3
    .scaleOrdinal()
    .domain(topo_combination.data_list)
    .range(Array.from(Array(topo_combination.data_list.length - 1).keys()))
  scale_set["sol"] = d3
    .scaleOrdinal()
    .domain(topo_combination.sol_list)
    .range(Array.from(Array(topo_combination.sol_list.length - 1).keys()))
  scale_set["all_ordinal"] = d3
    .scaleOrdinal()
    .domain(topo_combination.all_list)
    .range(Array.from(Array(topo_combination.all_list.length - 1).keys()))

  scale_set["all_linear_range"] = d3
    .scaleLog()
    .domain(d3.extent(all_all_list, (d) => d.weight))
    .range([0, 1])
  scale_set["color_node_type"] = d3
    .scaleOrdinal()
    .domain([1, 2, 3])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"])

  return scale_set
}

net_link_graph = (
  data,
  width = 1000,
  height = 1000,
  margin = {
    top: 20,
    right: 30,
    bottom: 40,
    left: 30
  }
) => {}

link_path = (d) => {
  if (d.is_directional == 1) {
    return linkArc(d)
  } else {
    return linkLine(d)
  }
}

linkArc = (d) => {
  const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y)
  return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
        `
}

linkLine = (d) => {
  const path = d3.path()
  path.moveTo(d.source.x, d.source.y)
  path.lineTo(d.target.x, d.target.y)
  return path.toString()
}

// Consider excluding property
// If it is TRUE, it will return path only with such property
// Consider ignoring property
// If it is true, it will transfer all qualified into required forms

data_filter_req = (
  data,
  key_word_list,
  is_exclude = false,
  is_pure = false
) => {
  if (typeof key_word_list == "string") {
    key_word_list = [key_word_list]
  }
  key_word_list = Array.from(key_word_list)
  data = d3.filter(data, (d) =>
    is_exclude
      ? req_iter_filter_exclude(d, key_word_list)
      : req_iter_filter_not_exclude(d, key_word_list)
  )

  if (is_pure) {
    data.forEach(
      (d) => (d.requirement.requirement_code = req_iter_pure(d, key_word_list))
    )
  }
  return data
}
req_iter_filter_exclude = (d, key_word_list) => {
  for (let i in key_word_list) {
    if (!(key_word_list[i] in d.requirement.requirement_code)) {
      return false
    }
  }
  return true
}
req_iter_filter_not_exclude = (d, key_word_list) => {
  for (let i in key_word_list) {
    if (key_word_list[i] in d.requirement.requirement_code) {
      return true
    }
  }
  return false
}

req_iter_pure = (d, key_word_list) => {
  let keys = d3.filter(
    Object.keys(d.requirement.requirement_code),
    (d) => key_word_list.indexOf(d) != -1
  )
  let rq_dict = {}

  for (let i in keys) {
    rq_dict[keys[i]] = 1
  }
  return rq_dict
}

data_filter_data = (
  data,
  key_word_list,
  is_exclude = false,
  is_pure = false
) => {
  if (typeof key_word_list == "string") {
    key_word_list = [key_word_list]
  }
  key_word_list = Array.from(key_word_list)
  data = d3.filter(data, (d) =>
    is_exclude
      ? data_iter_filter_exclude(d, key_word_list)
      : data_iter_filter_not_exclude(d, key_word_list)
  )
  if (is_pure) {
    data.forEach((d) => (d.data.data_code = data_iter_pure(d, key_word_list)))
  }
  return data
}

data_iter_filter_exclude = (d, key_word_list) => {
  for (let i in key_word_list) {
    if (!(key_word_list[i] in d.data.data_code) != -1) {
      return false
    }
  }
  return true
}
data_iter_filter_not_exclude = (d, key_word_list) => {
  for (let i in key_word_list) {
    if (key_word_list[i] in d.data.data_code) {
      return true
    }
  }
  return false
}

data_iter_pure = (d, key_word_list) => {
  let keys = d3.filter(
    Object.keys(d.data.data_code),
    (d) => key_word_list.indexOf(d) != -1
  )
  let data_set = {}
  for (let i in keys) {
    data_set[keys[i]] = 1
  }
  return data_set
}

data_filter_sol = (
  data,
  key_word_list,
  is_exclude = false,
  is_pure = false,
  position = -1
) => {
  if (typeof key_word_list == "string") {
    key_word_list = [key_word_list]
  }
  key_word_list = Array.from(key_word_list)

  data = d3.filter(data, (d) =>
    is_exclude
      ? sol_iter_filter_exclude(d, key_word_list, position)
      : sol_iter_filter_not_exclude(d, key_word_list, position)
  )
  if (is_pure) {
    data.forEach(
      (d) => (d.data.solution_code = sol_iter_pure(d, key_word_list, position))
    )
  }
  return data
}

sol_iter_filter_exclude = (d, key_word_list, position) => {
  if (position >= d.solution.length) {
    return false
  }

  if (position == -1) {
    return true
  } else {
    for (let i in key_word_list) {
      if (
        !(d.solution[position].componenet_code.indexOf(key_word_list[i]) != -1)
      ) {
        return false
      }
    }
    return true
  }
}

sol_iter_filter_not_exclude = (d, key_word_list, position) => {
  if (position >= d.solution.length) {
    return false
  }

  if (position == -1) {
    let sol_code_set = new Set()
    for (let i = 0; i < d.solution.length; i++) {
      for (let j = 0; j < d.solution[i].componenet_code.length; j++) {
        sol_code_set.add(d.solution[i].componenet_code[j])
      }
    }
    for (let i in key_word_list) {
      if (sol_code_set.has(key_word_list[i])) {
        return true
      }
    }
    return false
  } else {
    for (let i in key_word_list) {
      if (
        d.solution[position].componenet_code.indexOf(key_word_list[i]) != -1
      ) {
        return true
      }
    }
    return false
  }
}

sol_iter_pure = (d, key_word_list, position) => {
  let keys = d3.filter(
    Object.keys(d.data.data_code),
    (d) => key_word_list.indexOf(d) != -1
  )
  let data_set = {}
  for (let i in keys) {
    data_set[keys[i]] = 1
  }
  return data_set
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
      }
      last_sol_code = sol_list_iter[j]
    }
    req_data_topo = topo_merge(req_data_topo, req_data_topo_iter)
    data_sol_topo = topo_merge(data_sol_topo, data_sol_topo_iter)
    sol_sol_topo = topo_merge(sol_sol_topo, sol_sol_topo_iter)
    sol_sol_co = topo_merge(sol_sol_co, sol_sol_co_iter)
  }

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
      }
      last_sol_code = sol_list_iter[j]
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
      }
      last_sol_code = sol_list_iter[j]
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
          if (sol_list_iter[j][in_iter] != sol_list_iter[j][co_iter]) {
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
      }
      last_sol_code = sol_list_iter[j]
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
