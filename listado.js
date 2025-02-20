


function Main() {
  let datos = []
  let selected = null
  let comercioSelected = null

  return {
    model:{
      comercios: [
        {id: 1, name: "Quesomentero"},
        {id: 2, name: "Frutos Secos Chelo y Rocio"},
        {id: 3, name: "Pescaderia Toni Cuartero"},
        {id: 4, name: "Frutas y Verduras Mari"},
        {id: 5, name: "Pescaderia Sylvia"},
        {id: 6, name: "Vinos y Embutidos Santiago Manrique"},
        {id: 7, name: "Menjar preparat la cuina del Peix"},
        {id: 8, name: "Gelats i Torrons Maria Coloma"}
      ]
      
    },
    oninit: CargarDatos,
    view:()=> [
      datos.length === 0 
      ? m("h1",{style:{position:"fixed",left:"50%", transform:"translate(-50%, -50%)",top:"50%"}}, "Cargando...")
      : !comercioSelected
      ?[m("div",{style:{maxWidth:"1140px"}}, 
        m("h1",{style:{textAlign:"center",padding:"15px 0"}}, "Nuestros Comercios"),
        m("div", {style:{display:"flex",width:"100%",flexWrap:"wrap", justifyContent:"center", gap: "6px"}},
          console.log(datos),
          this.state.model.comercios.map(comercio=>[
            
            m("div", {style:{flex:"1 0 33%",height:"300px",justifyContent:"center",alignItems:"center",display:"flex", flexDirection:"column", borderRadius:"33px", backgroundColor:"#f2f2f2"}}, [
              m("h2", comercio.name),
              m("button", {onclick:()=>{comercioSelected=comercio;console.log(comercioSelected)}}, "Seleccionar"),
            ])

          ])
        ),
        m(ListadoCategorias),
        selected 
        ? m(ListadoProductosCategoria,selected) 
        : [
          m("div", {style:{display:"flex",width:"100%",flexWrap:"wrap", justifyContent:"center", gap: "6px"}},
          m(ListadoProductos)
        ),
        ]
        )
      ]
      : [
        m("div", {style:{display:"flex",width:"100%",flexWrap:"wrap", justifyContent:"center", gap: "6px", alignItems:"center"}},
          m("a", {style:{paddingRight:"50px", cursor:"pointer"}, onclick:()=>{comercioSelected=null}}, "Volver"),
          m("h1",{style:{textAlign:"center",padding:"15px 0"}}, "Seleccionado -> " + comercioSelected.name)
        )
        
      ]
    ]
  }

  function CargarDatos() {
        console.log("Cargando datos...");
        m.request({
          method: "GET",
          url: `products_output.json`, 
        })
  
        .then((result) => {
          console.log(result)
          datos = result;  
          m.redraw(); 
        })
  
        .catch((error) => {
          console.error("Error al cargar los datos:", error);
          datos = []; 
          m.redraw();  
        });
      
    
  }

  function CategoryTable () {

    return {
  
      oninit: (vnode) => {
       
        vnode.state.categories = [];
        vnode.state.loading = true;
        vnode.state.page = 1;
        vnode.state.categoriesPerPage = 10; 
    
  
        m.request({
          method: "GET",
          url: `products_output.json`, 
        })
  
        .then((result) => {
          console.log(result)
          vnode.state.categories = result;
          vnode.state.loading = false;  
          m.redraw(); 
        })
  
        .catch((error) => {
          console.error("Error al cargar los datos:", error);
          vnode.state.categories = []; 
          vnode.state.loading = false; 
          m.redraw();  
        });
  
      },
    
      loadMore: (vnode) => {
        
        vnode.state.page++;
        vnode.state.loading = true;
        
        m.request({
          method: "GET",
          url: `products_output.json`, 
        })
  
        .then((result) => {
          vnode.state.categories = vnode.state.categories.concat(result); 
          vnode.state.loading = false;
          m.redraw();  
        })
  
        .catch((error) => {
          console.error("Error al cargar los datos:", error);
          vnode.state.loading = false;
          m.redraw(); 
        });
  
      },
    
      view: (vnode) => {
  
        if (vnode.state.loading) {
          return m("div", "Cargando datos...");
        }
    
        const renderCategory = (category) => {
  
          return m("li", [
  
            m("h1", category.name), 
  
            category.subcategories.length > 0 
  
              ? m("div", [
  
                  m("h2", "Subcategorías:"),
  
                  m("ul", category.subcategories.map(subcategory => {
  
                    return m("li", [
  
                      m("h3", subcategory.name),
  
                      subcategory.subcategories.length > 0 
  
                        ? m("ul", subcategory.subcategories.map(subsubcategory =>
  
                            m("li", [
  
                              m("h4", subsubcategory.name),
                              m("ul", subsubcategory.products.map((product,index)=> [
  
                                index%2==0 
                                ? m("li", {style:{backgroundColor:"#f2f2f2",padding:"10px 0px"}},`${product.name}: `, m("span",{style:{fontWeight:"bold"}}, `${product.price}€`)) 
                                : m("li",{style:{padding:"10px 0px"}}, `${product.name}: `, m("span",{style:{fontWeight:"bold"}}, `${product.price}€`)),
                                m("hr")
                              ]
                              )),
                            ])
                          ))
                        : null
                    ]);
                }))
                
                ])
              : m("span", "Sin subcategorías") 
          ]);
        };
    
        const categories = vnode.state.categories;
    
        return m("div", [
          
          m("h1",{style:{textAlign:"center"}}, "Lista de Categorías y Productos"),
          m("ul", categories.length > 0 
  
            ? categories.map(renderCategory)
            : m("li", "No hay datos disponibles")
  
          ),
          m("button", {
  
            onclick: () => vnode.state.loading ? null : vnode.loadMore(vnode)
  
          }, vnode.state.loading ? "Cargando..." : "Cargar más")
        ]);
      }
  
    }
  
  };
  
  function ListadoCategorias() {
    return {
      view:({attrs})=> [
        console.log(datos),
        m("h1",{style:{padding:"50px 0px",textAlign:"center"}}, "Listado de Categorias"),
        m("ul",{style:{display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px", padding:"50px"}}, 
          datos.map(categoria=>[
            m("li",{
              onmouseenter:(e)=>{e.target.style.background="#c9c9c9"},
              onmouseleave:(e)=>{e.target.style.background="#f5f5f5"},
              style:{flex:"1 1 auto",listStyleType:"none",textAlign:"center", padding:"15px",backgroundColor:"#f5f5f5",transition:"all 0.3s ease", borderRadius:"33px", cursor:"pointer"}}, 
              m("a",{onclick:()=>{selected=categoria}, style:{textAlign:"center",color:"#000"}}, categoria.name)
            )
            ]
          ),
          m("li",{
            onmouseenter:(e)=>{e.target.style.background="#c9c9c9"},
            onmouseleave:(e)=>{e.target.style.background="#f5f5f5"},
            style:{flex:"1 1 auto",listStyleType:"none",textAlign:"center", padding:"15px",backgroundColor:"#f5f5f5",transition:"all 0.3s ease", borderRadius:"33px", cursor:"pointer"}}, 
            m("a",{onclick:()=>{selected=null}, style:{textAlign:"center",color:"#000"}}, "Ver todos")
          )
        )
      ]
    }
  }

  function ListadoProductosCategoria() {
    return {
      view:({attrs})=> [
        console.log(attrs),
        m("h1",{style:{textAlign:"center", padding:"50px 0px"}}, "Listado de Productos"),
        m("h1",{style:{padding:"30px", backgroundColor:"#f2f2f2",color:"black", textAlign:"center"}}, attrs.name),
        m("div",
          attrs.subcategories.map(subcategoria=>[
              m("h1",{style:{fontSize:"1.75em",lineHeight:"1.25", borderBottom:"1px solid #3b393733", margin:"16px 0 16px 12px", padding:"16px 0"}}, subcategoria.name),
              m("div",
                subcategoria.subcategories.map(subcategoria2=>[
                  m("h2",{style:{marginBottom:"16px", marginLeft:"12px", fontSize:"1.25em", lineHeight:"1.25"}}, subcategoria2.name),
                  m("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",flexDirection:"row",padding:"100px 0",borderRadius:"33px", gap:"10px"}}, subcategoria2.products.map((product,index)=> [                    
                      m("div", {style:{borderRadius:"33px",flex:"0 1 200px",height:"340px", backgroundColor:"#f2f2f2",display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center", padding:"10px 0px"}},

                         m("img",{src: 
                          subcategoria.name && subcategoria.name.toLowerCase().includes("pescado")  
                          ? `images/pescaderia/image${Math.floor(Math.random() * (119 - 2 + 1)) + 2}.jpg`
                          : subcategoria.name && subcategoria.name.toLowerCase().includes("vino") 
                          ? `images/pescaderia/image${Math.floor(Math.random() * (119 - 2 + 1)) + 2}.jpg`
                          :"5102174.png",width:"200px",height:"200px",style:{marginTop:"50px"}}),

                        // m("img",{src:"5102174.png",width:"100px",height:"100px",style:{marginTop:"50px"}}), 
                        m("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}},
                        m("p",{style:{textAlign:"center",padding:"0 5px"}}, `${product.name}`),
                        // m("br"), 
                        // m("span",{style:{fontWeight:"bold",margin:"0 0 15px 0"}}, `${product.price}€`)
                        )
                      ) 
                    
                  ]
                  )),
                ]) 
              )
            ]
          )
        )
      ]
    }

  }

  function ListadoProductos() {
    return {
      view:()=> [
        m("h1",{style:{textAlign:"center"}}, "Todos los Productos"),
        m("div",
          datos.map(attrs=>[
            m("h1",{style:{padding:"30px", backgroundColor:"#f2f2f2",color:"black", textAlign:"center"}}, attrs.name),
            m("div",
              attrs.subcategories.map(subcategoria=>[
                m("h1",{style:{fontSize:"1.75em",lineHeight:"1.25", borderBottom:"1px solid #3b393733", margin:"16px 0 16px 12px", padding:"16px 0"}}, subcategoria.name),
                m("div",
                  subcategoria.subcategories.map(subcategoria2=>[
                    m("h2",{style:{marginBottom:"16px", marginLeft:"12px", fontSize:"1.25em", lineHeight:"1.25"}}, subcategoria2.name),
                    m("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",flexDirection:"row",padding:"100px 0",borderRadius:"33px", gap:"10px"}}, subcategoria2.products.map((product,index)=> [                    
                        m("div", {style:{borderRadius:"33px",flex:"0 1 200px",height:"340px", backgroundColor:"#f2f2f2",display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center", padding:"10px 0px"}},
                          m("img",{src:"5102174.png",width:"100px",height:"100px",style:{marginTop:"50px"}}), 
                          m("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}},
                          m("p",{style:{textAlign:"center",padding:"0 5px"}}, `${product.name}`),
                          m("br"), 
                          m("span",{style:{fontWeight:"bold",margin:"0 0 15px 0"}}, `${product.price}€`)
                          )
                        ) 
                      
                    ]
                    )),
                  ]) 
                )
              ]
            )
            )
          ]
        )
      )
      ]
    }
  }

}
  
  m.mount(document.body, Main);
  