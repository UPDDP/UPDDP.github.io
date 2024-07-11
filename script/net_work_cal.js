let filter_list = []
const REQUIREMENTOPTIONSLIST = [
  "discover_observation",
  "describe_observation_item",
  "describe_observation_aggregate",
  "identify_main_cause_item",
  "identify_main_cause_aggregate",
  "collect_evidence",
  "compare_entities",
  "explain_differences",
  "evaluate_hypothesis",
  "knowledge_injection",
  "sharing_findings",
  "parameter_setting",
  "data_filtering",
  "modeling_and_enhancement",
  "flexibility_and_scalability",
  "interactivity",
  "ensuring_data_quality"
]
const DATAOPTIONSLIST = [
  "tables",
  "network_and_trees",
  "fields",
  "geometry",
  "clusters_and_sets_and_lists",
  "textual",
  "temporal",
  "media",
  "categorical",
  "ordinal",
  "quantitative",
  "parameter",
  "sequential",
  "diverging",
  "cyclic"
]

const SOLOPTIONSLIST = [
  "real_time_input",
  "user_input",
  "algorithmic_calculation",
  "modeling",
  "clustering_and_grouping",
  "excluding",
  "sampling",
  "dimensionality_reduction",
  "feature_selection",
  "retrieval",
  "similarity_calculation",
  "explainability",
  "rectification",
  "parameter_tuning",
  "wrangling",
  "repetition",
  "mirror",
  "stack",
  "co_axis",
  "coordinate",
  "annotation",
  "large_panel",
  "nesting",
  "aligned",
  "flexible",
  "basics",
  "filtering",
  "selecting",
  "abstract_elaborate",
  "overview_and_explore",
  "connect_relate",
  "reconfigure",
  "encode",
  "history",
  "extraction_of_features",
  "participation_collaboration",
  "gamification",
  "table",
  "bar",
  "text",
  "network",
  "contour",
  "arc",
  "image",
  "area",
  "tree",
  "circle",
  "parallelcoordinates",
  "scatter",
  "donut",
  "boxplot",
  "glyph",
  "heatmap",
  "video",
  "link",
  "line",
  "vector",
  "pie",
  "matrix",
  "map",
  "radar",
  "hexagonarea",
  "3Dstructure",
  "sankey",
  "flow",
  "bubble",
  "icicle",
  "radialbar",
  "animation",
  "rectangle",
  "chord",
  "others",
  "stripe",
  "point",
  "wordcloud",
  "treemap",
  "violet_graph"
]

// Upd filter List
let upd_filter_list = (filter_list) => {
  let selectedFilters = $("#selectedReq")
  selectedFilters.empty()
  filter_list
    .filter((d) => d.type == "requirement")
    .forEach((iter) => {
      const li = document.createElement("li")
      li.textContent = iter.key_word_list[0]
      selectedFilters.append(li)
    })
  selectedFilters = $("#selectedData")
  selectedFilters.empty()
  filter_list
    .filter((d) => d.type == "data")
    .forEach((iter) => {
      const li = document.createElement("li")
      li.textContent = iter.key_word_list[0]
      selectedFilters.append(li)
    })
  selectedFilters = $("#selectedSol")
  selectedFilters.empty()
  filter_list
    .filter((d) => d.type == "solution")
    .forEach((iter) => {
      const li = document.createElement("li")
      li.textContent = iter.key_word_list[0]
      selectedFilters.append(li)
    })
}

function updateSelected() {
  let selectedFilters = document.getElementById("selectedReq")

  let filtersContainer = document.getElementById("requirementContainer")
  let selects = filtersContainer.querySelectorAll("select")

  selects.forEach((select) => {
    Array.from(select.selectedOptions).forEach((option) => {
      if (
        filter_list.filter((d) => d.type == "requirement").length ==
        REQUIREMENTOPTIONSLIST.length
      ) {
        filter_list = filter_list.filter((d) => d.type != "requirement")
      }
      if (
        filter_list.filter((d) => d.key_word_list[0] == option.value).length ==
        0
      ) {
        filter_list.push({
          type: "requirement",
          key_word_list: [option.value],
          is_exclude: false,
          is_pure: false
        })
      }
    })
  })

  selectedFilters = document.getElementById("selectedData")
  selectedFilters.innerHTML = ""
  filtersContainer = document.getElementById("dataContainer")
  selects = filtersContainer.querySelectorAll("select")

  selects.forEach((select) => {
    Array.from(select.selectedOptions).forEach((option) => {
      if (
        filter_list.filter((d) => d.type == "data").length ==
        DATAOPTIONSLIST.length
      ) {
        filter_list = filter_list.filter((d) => d.type != "data")
      }
      if (
        filter_list.filter((d) => d.key_word_list[0] == option.value).length ==
        0
      ) {
        filter_list.push({
          type: "data",
          key_word_list: [option.value],
          is_exclude: false,
          is_pure: false
        })
      }
    })
  })

  selectedFilters = document.getElementById("selectedSol")
  selectedFilters.innerHTML = ""
  filtersContainer = document.getElementById("solContainer")
  selects = filtersContainer.querySelectorAll("select")

  selects.forEach((select) => {
    Array.from(select.selectedOptions).forEach((option) => {
      if (
        filter_list.filter((d) => d.type == "solution").length ==
        SOLOPTIONSLIST.length
      ) {
        filter_list = filter_list.filter((d) => d.type != "solution")
      }
      if (
        filter_list.filter((d) => d.key_word_list[0] == option.value).length ==
        0
      ) {
        filter_list.push({
          type: "solution",
          key_word_list: [option.value],
          is_exclude: false,
          is_pure: false,
          position: d3.filter(filter_list, (d) => d.type == "solution").length
        })
      }
    })
  })
  upd_filter_list(filter_list)
  /*     filter_list
      .filter((d) => d.type == "requirement")
      .forEach((iter) => {
        const li = document.createElement("li")
        li.textContent = iter.key_word_list[0]
        selectedFilters.appendChild(li)
      }) */
  draw_explorer_svg()
  document.getElementById("selector_req").selectedIndex = -1
  document.getElementById("selector_data").selectedIndex = -1
  document.getElementById("selector_sol").selectedIndex = -1
}

// Req Btn
document.addEventListener("DOMContentLoaded", function () {
  const filtersContainer = document.getElementById("requirementContainer")
  const selectedFilters = document.getElementById("selectedReq")

  const filterDiv = document.createElement("div")
  filterDiv.className = "tooltip-container mb-2 selector"
  const tooltipContent = document.createElement("div")
  tooltipContent.className = "tooltip-content"

  const select = document.createElement("select")
  select.className = "form-control  mb-2"
  select.id = "selector_req"

  select.innerHTML = REQUIREMENTOPTIONSLIST.map(
    (option) => `<option value="${option}">${option}</option>`
  ).join("")
  tooltipContent.appendChild(select)
  select.selectedIndex = -1

  const confirmBtn = document.getElementById("confirmBtn")

  confirmBtn.addEventListener("click", function () {
    updateSelected()
    //    updateSelectedFiltersReq(select)
  })
  if ($("#requirementContainer").children().length == 0) {
    filterDiv.appendChild(tooltipContent)
    filtersContainer.appendChild(filterDiv)
  }

  function updateSelectedFiltersReq(select) {
    selectedFilters.innerHTML = ""

    const selects = filtersContainer.querySelectorAll("select")

    selects.forEach((select) => {
      Array.from(select.selectedOptions).forEach((option) => {
        if (
          filter_list.filter((d) => d.type == "requirement").length ==
          REQUIREMENTOPTIONSLIST.length
        ) {
          filter_list = filter_list.filter((d) => d.type != "requirement")
        }
        if (
          filter_list.filter((d) => d.key_word_list[0] == option.value)
            .length == 0
        ) {
          filter_list.push({
            type: "requirement",
            key_word_list: [option.value],
            is_exclude: false,
            is_pure: false
          })
        }
      })
    })
    upd_filter_list(filter_list)
    /*     filter_list
      .filter((d) => d.type == "requirement")
      .forEach((iter) => {
        const li = document.createElement("li")
        li.textContent = iter.key_word_list[0]
        selectedFilters.appendChild(li)
      }) */
    draw_explorer_svg()
  }
})

// Data Btn
document.addEventListener("DOMContentLoaded", function () {
  const filtersContainer = document.getElementById("dataContainer")
  const selectedFilters = document.getElementById("selectedData")

  const filterDiv = document.createElement("div")
  filterDiv.className = "tooltip-container mb-2 selector"
  const tooltipContent = document.createElement("div")
  tooltipContent.className = "tooltip-content"

  const select = document.createElement("select")
  select.className = "form-control  mb-2"
  select.id = "selector_data"
  select.innerHTML = DATAOPTIONSLIST.map(
    (option) => `<option value="${option}">${option}</option>`
  ).join("")
  tooltipContent.appendChild(select)
  select.selectedIndex = -1
  const confirmBtn = document.getElementById("confirmBtn")

  confirmBtn.addEventListener("click", function () {
    updateSelected()
    // updateSelectedFiltersData(select)
  })
  if ($("#dataContainer").children().length == 0) {
    filterDiv.appendChild(tooltipContent)
    filtersContainer.appendChild(filterDiv)
  }

  function updateSelectedFiltersData(select) {
    selectedFilters.innerHTML = ""

    const selects = filtersContainer.querySelectorAll("select")

    selects.forEach((select) => {
      Array.from(select.selectedOptions).forEach((option) => {
        if (
          filter_list.filter((d) => d.type == "data").length ==
          REQUIREMENTOPTIONSLIST.length
        ) {
          filter_list = filter_list.filter((d) => d.type != "data")
        }
        if (
          filter_list.filter((d) => d.key_word_list[0] == option.value)
            .length == 0
        ) {
          filter_list.push({
            type: "data",
            key_word_list: [option.value],
            is_exclude: false,
            is_pure: false
          })
        }
      })
    })
    upd_filter_list(filter_list)
    /*     filter_list
      .filter((d) => d.type == "data")
      .forEach((iter) => {
        const li = document.createElement("li")
        li.textContent = iter.key_word_list[0]
        selectedFilters.appendChild(li)
      }) */
    draw_explorer_svg()
  }
})

// Sol Btn
document.addEventListener("DOMContentLoaded", function () {
  const filtersContainer = document.getElementById("solContainer")
  const selectedFilters = document.getElementById("selectedSol")

  const filterDiv = document.createElement("div")
  filterDiv.className = "tooltip-container mb-2 selector"
  const tooltipContent = document.createElement("div")
  tooltipContent.className = "tooltip-content"

  const select = document.createElement("select")
  select.className = "form-control  mb-2"
  select.id = "selector_sol"

  select.innerHTML = SOLOPTIONSLIST.map(
    (option) => `<option value="${option}">${option}</option>`
  ).join("")
  tooltipContent.appendChild(select)
  select.selectedIndex = -1
  const confirmBtn = document.getElementById("confirmBtn")

  confirmBtn.addEventListener("click", function () {
    updateSelected()
    //updateSelectedFiltersSol(select)
  })
  if ($("#solContainer").children().length == 0) {
    filterDiv.appendChild(tooltipContent)
    filtersContainer.appendChild(filterDiv)
  }

  function updateSelectedFiltersSol(select) {
    selectedFilters.innerHTML = ""

    const selects = filtersContainer.querySelectorAll("select")
    selects.forEach((select) => {
      Array.from(select.selectedOptions).forEach((option) => {
        if (
          filter_list.filter((d) => d.type == "solution").length ==
          REQUIREMENTOPTIONSLIST.length
        ) {
          filter_list = filter_list.filter((d) => d.type != "solution")
        }
        if (
          filter_list.filter((d) => d.key_word_list[0] == option.value)
            .length == 0
        ) {
          filter_list.push({
            type: "solution",
            key_word_list: [option.value],
            is_exclude: false,
            is_pure: false,
            position: d3.filter(filter_list, (d) => d.type == "solution").length
          })
        }
      })
    })
    upd_filter_list(filter_list)
    /*     filter_list
      .filter((d) => d.type == "solution")
      .forEach((iter) => {
        const li = document.createElement("li")
        li.textContent = iter.key_word_list[0]
        selectedFilters.appendChild(li)
      }) */
    draw_explorer_svg()
  }
})

// Reset Btn
document.addEventListener("DOMContentLoaded", function () {
  const resetBtn = document.getElementById("resetBtn")

  resetBtn.addEventListener("click", function () {
    reset_btn()
  })

  function reset_btn() {
    filter_list = []
    $("#selectedReq").empty()
    $("#selectedData").empty()
    $("#selectedSol").empty()
    draw_explorer_svg()
  }
})

init_edge = (id, node, scale_set) => {
  node
    .attr("class", (d) => create_class_edge(id, d))
    .attr("id", (d) => `Topo_line_${d.source.id}_${d.target.id}`)
    .attr("stroke", (d) => link_color(d, scale_set))
    .attr("stroke-width", (d) => scale_set.weight(d.weight))
    .attr("fill", "none")
    .attr("isCalled", "false")
    .attr("d", (d) => link_path(d))
    .attr("opacity", 0.3)
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
      d3.select("#explore").select("#custom_tooltip").remove()
    })
}

data_2_grid = (data) => {
  let grid_data = []
  let grid_fields = []
  grid_fields.push({
    name: "ID",
    title: "ID",
    type: "number",
    width: 50
  })
  grid_fields.push({
    name: "title",
    type: "text",
    title: "Paper Title",
    width: 400
  })
  grid_fields.push({
    name: "pubYear",
    type: "text",
    title: "Pub Year",
    width: 70
  })
  grid_fields.push({
    name: "domain",
    type: "text",
    title: "Domain",
    width: 200
  })
  grid_fields.push({
    name: "req",
    type: "text",
    title: "Requirement",
    width: 400
  })
  grid_fields.push({
    name: "reqType",
    type: "text",
    title: "Requirement Code",
    width: 200
  })
  grid_fields.push({
    name: "data",
    type: "text",
    title: "Data",
    width: 400
  })
  grid_fields.push({
    name: "dataType",
    type: "text",
    title: "Data Codes",
    width: 200
  })
  let sol_length = d3.max(data, (d) => d.solution.length)
  for (let i = 0; i < sol_length; i++) {
    grid_fields.push({
      name: `sol${i}`,
      type: "text",
      title: `Solution ${i}`,
      width: 400
    })
    grid_fields.push({
      name: `solType${i}`,
      type: "text",
      title: `Solution Code ${i}`,
      width: 200
    })
  }
  data.forEach((d, index) => {
    let iter = {}
    iter["ID"] = d.index_original
    iter["title"] = d.paper_title
    iter["pubYear"] = d.pub_year
    iter["domain"] = d.domain
    iter["req"] = d.requirement.requirement_text
    iter["reqType"] = Object.keys(d.requirement.requirement_code).join(";")
    iter["data"] = d.data.data_text
    iter["dataType"] = Object.keys(d.data.data_code).join(";")
    for (let i = 0; i < d.solution.length; i++) {
      iter[`sol${i}`] = d.solution[i].solution_text
      iter[`solType${i}`] = d.solution[i].componenet_code[0]
    }
    for (let i = d.solution.length; i < sol_length; i++) {
      iter[`sol${i}`] = ""
      iter[`solType${i}`] = ""
    }
    grid_data.push(iter)
  })
  return { grid_data: grid_data, grid_fields: grid_fields }
}

init_node = (id, node, scale_set, simulation) => {
  node
    .attr("d", (d) => path_form(d.group, scale_set.linear_node_size(d.weight)))
    .attr("fill", (d) => scale_set.color_node_type(d.group))
    .attr("class", (d) => `node`)
    .attr("id", (d) => `node_${d.id}`)
    .attr("stroke", "white")
    .attr("stroke-width", 2)
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
    .attr("refX", 10)
    .attr("refY", -0)
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
  marker_set,
  scale_set
) => {
  link_set
    .selectAll(".lines")
    .attr("stroke-width", (d) => scale_set.weight(d.weight))
  // nodes.selectall(".node").attr("d", (d) => path_form(d.group, 400))
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
      marker_set
        .select(`#Topo_arrow_${req}_${data}`)
        .attr("fill", (d) => "red")
        .attr("refX", 8)
        .attr("refY", -0)
        .attr("markerWidth", 2)
        .attr("markerHeight", 2.5)
    })
  })
  let source_node = ""
  filter_list.forEach((d) => {
    d.key_word_list.forEach((k) => {
      //node_set.select(`.node_${k}`).attr("d", (d) => path_form(d.group, 400))
      // gaoshh1
      node_set.select(`#node_${k}`).attr("stroke", "red")

      if (d.type == "solution") {
        if (source_node == "") {
          data_code_list.forEach((data) => {
            link_set
              .select(`.Topo_arrow_${data}_${k}`)
              .attr("opacity", 1)
              .attr("stroke", "red")
            marker_set
              .select(`#Topo_arrow_${data}_${k}`)
              .attr("fill", (d) => "red")
              .attr("refX", 8)
              .attr("refY", -0)
              .attr("markerWidth", 2)
              .attr("markerHeight", 2.5)
          })
        } else {
          link_set
            .select(`.Topo_arrow_${source_node}_${k}`)
            .attr("opacity", 1)
            .attr("stroke", "red")
          marker_set
            .select(`#Topo_arrow_${source_node}_${k}`)
            .attr("fill", (d) => "red")
            .attr("refX", 8)
            .attr("refY", -0)
            .attr("markerWidth", 2)
            .attr("markerHeight", 2.5)
        }

        source_node = k
      }
    })
  })
}

create_class_edge = (id, d) => {
  switch (id) {
    case "#explore":
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
    .style("left", x + 50 + "px")
    .style("top", y + 100 + "px")
}

tooltip_html = (id, d, type) => {
  switch (type) {
    case "node":
      return `Type: ${d.id} <br/> Weight: ${d.weight}`
      break
    case "link":
      switch (id) {
        case "#explore":
          if ("pattern_specify" in d) {
            return `This link is from ${d.source.id} to ${d.target.id} <br/> Weight: ${d.weight}<br/> Pattern: ${d.pattern_specify}`
          } else {
            return `This link is from ${d.source.id} to ${d.target.id} <br/> Weight: ${d.weight}`
          }
        case "#pattern":
          if ("pattern_specify" in d) {
            return `This link is from ${d.source} to ${d.target} <br/> Weight: ${d.weight}<br/> Pattern: ${d.pattern_specify}`
          } else {
            return `This link is from ${d.source} to ${d.target} <br/> Weight: ${d.weight}`
          }
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
    case 4:
    case 5:
      return d3
        .symbol()
        .type(d3.symbolCircle)
        .size(size + 40)()
      break
    default:
      break
  }
}

link_color = (d, scale_set) => {
  if (d.is_directional == 1) {
    return "grey"
  } else {
    if ("pattern_specify" in d) {
      return scale_set.multlple_link_color(d.pattern_specify)
    }
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
    vis_axial_list: [
      ...sol["visualization"]["composite"],
      ...sol["visualization"]["non_composite"]
    ],
    data_manipulation_list: sol["data_manipulation"],
    interaction_list: sol["interaction"]
  }
  let all_list = []
  d3.map(topo.req_list, (d) => all_list.push({ id: d, group: 1 }))
  d3.map(topo.data_list, (d) => all_list.push({ id: d, group: 2 }))
  d3.map(sol["data_manipulation"], (d) => all_list.push({ id: d, group: 3 }))
  d3.map(sol["vis_component"], (d) => all_list.push({ id: d, group: 4 }))
  d3.map(sol["interaction"], (d) => all_list.push({ id: d, group: 5 }))

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
  return data
}

upd_all_all_list = (
  data_original,
  topo_combination,
  filter_dict = [],
  is_filter_zero_weight_link = true,
  is_category = false
) => {
  let data = data_process(data_original, filter_dict)

  let topo = edge_building_matrix_paper(data, topo_combination)
  return link_building(topo, is_filter_zero_weight_link, is_category)
}

link_building = (
  topo,
  is_filter_zero_weight_link = true,
  is_category = false
) => {
  let req_data_list = dict2list(topo.req_data_topo)
  let data_sol_list = dict2list(topo.data_sol_topo)
  let sol_sol_list = dict2list(topo.sol_sol_topo)
  let sol_sol_co_list = dict2list_co(topo.sol_sol_co, is_category)

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
  draw_explorer_svg()
}

draw_explorer_svg = () => {
  var width = $("#explorerContainerPar").width()
  console.log(width)
  $("#explorerContainerPar").css("height", width > 100 ? width : 720)
  $("#explorerFilterPar").css("height", width > 100 ? width : 720)
  Promise.all([
    d3.json("./static/data.json"),
    d3.json("./static/requirement_topo.json"),
    d3.json("./static/data_topo.json"),
    d3.json("./static/sol_topo.json")
  ]).then(([data_original, req_topo, data_topo, sol_topo]) => {
    d3.select("#explorerContainer").select("svg").remove()
    let draw_force = (
      data_original,
      req_topo,
      data_topo,
      sol_topo,
      filter_list
    ) => {
      let topo_combination = topo_building(req_topo, data_topo, sol_topo)

      let all_all_list = upd_all_all_list(
        data_original,
        topo_combination,
        filter_list,
        true,
        true
      )
      //  all_all_list = d3.filter(all_all_list, (d) => d.is_directional == 0)
      //all_all_list = d3.filter(all_all_list, (d) => d.source == d.target)
      let node_list = topo_combination.all_list.map((d) => ({ ...d }))

      //gaoshh1
      node_list.forEach((d, index) => {
        node_list[index].weight = d3.sum(
          d3.filter(
            all_all_list,
            (l) =>
              (l.source == d.id || l.target == d.id) && l.is_directional == 1
          ),
          (l) => l.weight
        )
      })
      let scale_set = scale_set_create(topo_combination, all_all_list)
      scale_set.linear_node_size = d3
        .scaleLinear()
        .domain(d3.extent(node_list, (d) => d.weight))
        .range([100, 1600])
      let main_svg = d3
        .select("#explorerContainer")
        .append("svg")
        .attr("id", "explorerSvg")
      let width = $("#explorerContainer").width()
      let height = $("#explorerContainer").height()
      main_svg.attr("width", width).attr("height", height)
      /*       .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("border-color", "grey") */
      //.style("margin-left", "10%")

      let simulation = (d3.simulation = d3
        .forceSimulation()
        .nodes(node_list)
        .force(
          "link",
          d3.forceLink(all_all_list).id((d) => d.id)
        )
        .force("charge", d3.forceManyBody().strength(-400))
        .force("x", d3.forceX())
        .force("y", d3.forceY())).force(
        "center",
        d3.forceCenter(width / 2, height / 2)
      )
      /*        .alpha(1)
        .alphaDecay(0.05)
        .alphaMin(0.01)
 */
      const link = main_svg
        .append("g")
        .attr("class", "links")
        .selectAll("path")
        .data(
          all_all_list,
          (d) => `${d.source.id}_${d.target.id}_${d.is_directional}`
        )
        .join("path")

      init_edge("#explore", link, scale_set)
      let marker = main_svg
        .append("g")
        .attr("class", "markers")
        .selectAll("defs")
        .data(all_all_list)
        .join("defs")
      init_marker("#explore", marker, scale_set)

      let node = main_svg
        .append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(node_list, (d) => d.id)
        .join("path")

      init_node("#explore", node, scale_set, simulation)
      simulation.on("tick", () => {
        /*         link.attr("d", link_path)
        node.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
        if (simulation.alpha() < 0.1) {
          simulation.stop()
        } */
      })

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
        if (!event.active) {
          simulation.alphaTarget(0)
        }
        event.subject.fx = null
        event.subject.fy = null
      }
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
          add_tool_tip("#explore", d, event.clientX, event.clientY, "node")
        })
        .on("mouseout", (event, d) => {
          d3.select("#explore").select("#custom_tooltip").remove()
        })
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )
      // Add a drag behavior.
      console.log(filter_list)
      if (filter_list.length != 0) {
        upd_force(
          data_original,
          req_topo,
          data_topo,
          sol_topo,
          filter_list,
          simulation
        )
      } else {
        simulation.stop()
        Promise.all([
          d3.csv("./static/preNode.csv"),
          d3.csv("./static/preLine.csv")
        ]).then(([preNode, preLine]) => {
          let preNodeObject = {}
          preNode.forEach((d) => {
            preNodeObject[d.id] = d
          })
          let preLineObject = {}
          preLine.forEach((d) => {
            preLineObject[d.id] = d
          })
          link.attr("d", (d) => {
            d.source.x = +preNodeObject[`node_${d.source.id}`].X
            d.source.y = +preNodeObject[`node_${d.source.id}`].Y
            d.target.x = +preNodeObject[`node_${d.target.id}`].X
            d.target.y = +preNodeObject[`node_${d.target.id}`].Y
            return preLineObject[`Topo_line_${d.source.id}_${d.target.id}`].D
          })
          node.attr("transform", (d) => {
            d.x = +preNodeObject[`node_${d.id}`].X
            d.y = +preNodeObject[`node_${d.id}`].Y

            return (
              "translate(" +
              +preNodeObject[`node_${d.id}`].X +
              "," +
              +preNodeObject[`node_${d.id}`].Y +
              ")"
            )
          })
        })
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
      console.log(filter_list)
      console.log("up")
      let topo_combination = topo_building(req_topo, data_topo, sol_topo)
      let all_all_list = upd_all_all_list(
        data_original,
        topo_combination,
        filter_list,
        true,
        true
      )

      //all_all_list = d3.filter(all_all_list, (d) => d.source == d.target)
      //gaoshh1
      let node_list = topo_combination.all_list.map((d) => ({ ...d }))
      node_list.forEach((d, index) => {
        node_list[index].weight = d3.sum(
          d3.filter(
            all_all_list,
            (l) =>
              (l.source == d.id || l.target == d.id) && l.is_directional == 1
          ),
          (l) => l.weight
        )
      })
      let scale_set = scale_set_create(topo_combination, all_all_list)
      scale_set.linear_node_size = d3
        .scaleLinear()
        .domain(d3.extent(node_list, (d) => d.weight))
        .range([100, 800])
      let main_svg = d3.select("#explore").select("svg")
      simulation.nodes(node_list).force(
        "link",
        d3.forceLink(all_all_list).id((d) => d.id)
      )
      const link = main_svg.selectAll(".links")
      link
        .selectAll("path")
        .data(
          all_all_list,
          (d) => `${d.source.id}_${d.target.id}_${d.is_directional}`
        )
        .join("path")

      let marker = main_svg.select(".marker").selectAll("defs")
      //.data(all_all_list)
      //.join("defs")
      let marker_set = main_svg.select(".markers")
      //init_marker("#explore", marker, scale_set)
      const node = main_svg.select(".nodes")
      node
        .selectAll(".node")
        .data(node_list, (d) => d.id)
        .join("path")
      init_edge("#explore", link.selectAll("path"), scale_set)
      init_node("#explore", node.selectAll(".node"), scale_set, simulation)
      // Set the position attributes of links and nodes each time the simulation ticks.
      link.selectAll("path").attr("d", link_path)
      simulation.on("tick", () => {
        link.selectAll("path").attr("d", link_path)
        node
          .selectAll(".node")
          .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
        /*     if (simulation.alpha() < 0.1) {
          simulation.stop()
        } */
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
      //
      node
        .selectAll(".node")
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
          add_tool_tip("#explore", d, event.clientX, event.clientY, "node")
        })
        .on("mouseout", (event, d) => {
          d3.select("#explore").select("#custom_tooltip").remove()
        })
      upd_link_and_node_and_marker(
        filter_list,
        link,
        node,
        marker_set,
        scale_set
      )

      node
        .selectAll(".node")
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )
      // Add a drag behavior.
      filtered_data = data_process(data_original, filter_list)

      let gridCom = data_2_grid(filtered_data)
      console.log(gridCom)
      $("#explorer_grid").jsGrid({
        height: "700",
        width: "100%",
        paging: true,
        pageSize: 15,
        pageButtonCount: 5,
        gridview: true,
        sorting: true,
        paging: true,

        data: gridCom.grid_data,

        fields: gridCom.grid_fields,
        onRefreshed: function (args) {
          console.log(args.grid)
        }
      })
      d3.selectAll(".jsgrid-cell").attr("height", "10px")
      upd_filter_list(filter_list)
    }

    draw_force(data_original, req_topo, data_topo, sol_topo, filter_list)
  })
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

dict2list_co = (dict, is_category = false) => {
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
      let index_co = 0
      if (is_category) {
        for (const [key, value] of Object.entries(
          dict[out_key_list[out_key_index]][in_key_list[in_key_index]].pattern
        )) {
          list.push({
            source: out_key_list[out_key_index],
            target: in_key_list[in_key_index],
            weight:
              dict[out_key_list[out_key_index]][in_key_list[in_key_index]]
                .pattern[key],
            pattern_specify: key,
            pattern:
              dict[out_key_list[out_key_index]][in_key_list[in_key_index]]
                .pattern,
            index_co: index_co
          })
          index_co += 1
        }
      } else {
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
    .domain([0, d3.max(all_all_list, (d) => d.weight + 1)])
    .range([0, 1])
  scale_set["color_node_type"] = d3
    .scaleOrdinal()
    .domain([1, 2, 3, 4, 5])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#5eb75e", "#bae0ba"])

  scale_set["multlple_link_color"] = d3
    .scaleOrdinal()
    .domain(topo_combination["vis_axial_list"])
    .range(["#2ca02c", "#2ca02c", "#2ca02c", "#2ca02c", "#2ca02c"])
  scale_set["weight"] = d3
    .scaleLinear()
    .domain([0, d3.max(all_all_list, (d) => d.weight)])
    .range([1, 10])

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
  let para = 3
  let source_x = d.source.x
  let source_y = d.source.y
  let target_x = d.target.x
  let target_y = d.target.y
  let h = target_y - source_y
  let l = target_x - source_x
  let cos = l / Math.hypot(h, l)
  let sin = h / Math.hypot(h, l)

  if ("index" in d) {
    source_x += parseInt(d.index_co / 2) * (-1) ** d.index * sin * para
    source_y -= parseInt(d.index_co / 2) * (-1) ** d.index * cos * para
    target_x += parseInt(d.index_co / 2) * (-1) ** d.index * sin * para
    target_y -= parseInt(d.index_co / 2) * (-1) ** d.index * cos * para
  }

  path.moveTo(source_x, source_y)
  path.lineTo(target_x, target_y)
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
  data = d3.filter(data, (d) => {
    return is_exclude
      ? sol_iter_filter_exclude(d, key_word_list, position)
      : sol_iter_filter_not_exclude(d, key_word_list, position)
  })
  let data_new = []
  data.forEach((d) => {
    let flag = is_exclude
      ? sol_iter_filter_exclude(d, key_word_list, position)
      : sol_iter_filter_not_exclude(d, key_word_list, position)
    if (flag) {
      data_new.push(d)
    }
  })
  return data_new
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
  let flag = false

  if (position == -1) {
    let sol_code_set = new Set()
    for (let i = 0; i < d.solution.length; i++) {
      for (let j = 0; j < d.solution[i].componenet_code.length; j++) {
        sol_code_set.add(d.solution[i].componenet_code[j])
      }
    }
    for (let i in key_word_list) {
      if (sol_code_set.has(key_word_list[i])) {
        flag = true
      }
    }
    return false
  } else {
    for (let i in key_word_list) {
      /*      if (
        d.solution[position].componenet_code.indexOf(key_word_list[i]) != -1
      ) {
        return true
      } */
      let index = 0
      let node_num = 0
      while (index != position + 1) {
        if (node_num == d.solution.length) {
          break
        }
        if (d.solution[node_num].solution_category == "data_manipulation") {
          d.solution[node_num].componenet_code.forEach((k) => {
            if (key_word_list.indexOf(k) != -1) {
              flag = true
              return true
            }
            index += 1
          })
          node_num += 1
        } else {
          if (
            d.solution[node_num].componenet_code.indexOf(key_word_list[i]) != -1
          ) {
            flag = true
          }
          index += 1
          node_num += 1
        }
      }
    }
    return flag
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
