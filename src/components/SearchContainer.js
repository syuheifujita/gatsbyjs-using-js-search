import React, { Component } from "react"
import Axios from "axios"
import * as JsSearch from "js-search"

class Search extends Component {
    state = {
        newsList: [],
        search: [],
        searchResults: [],
        isLoading: true,
        isError: false,
        searchQuery: ``,
    }

    async componentDidMount() {
        Axios.get(`https://bvaughn.github.io/js-search/books.json`)
            .then(result => {
                const newsData = result.data
                this.setState({ newsList: newsData.news })
                this.rebuildIndex()
            })
            .catch(err => {
                this.setState({ isError: true })
                console.log(`====================================`)
                console.log(`Something bad happened while fetching the data\n${err}`)
                console.log(`====================================`)
            })
    }

    rebuildIndex = () => {
        const { newsList } = this.state
    
        const dataToSearch = new JsSearch.Search(`isbn`)
    
        /**
         *  defines a indexing strategy for the data
         * more more about it in here https://github.com/bvaughn/js-search#configuring-the-index-strategy
         */
        dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy()
    
        /**
         * defines the sanitizer for the search
         * to prevent some of the words from being excluded
         *
         */
        dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer()
    
        /**
         * defines the search index
         * read more in here https://github.com/bvaughn/js-search#configuring-the-search-index
         */
        dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex(`isbn`)
    
        dataToSearch.addIndex(`title`) // sets the index attribute for the data
        dataToSearch.addIndex(`author`) // sets the index attribute for the data
    
        dataToSearch.addDocuments(newsList) // adds the data to be searched
        this.setState({ search: dataToSearch, isLoading: false })
      }
    
      /**
       * handles the input change and perform a search with js-search
       * in which the results will be added to the state
       */
      searchData = e => {
        const { search } = this.state
        const queryResult = search.search(e.target.value)
        this.setState({ searchQuery: e.target.value, searchResults: queryResult })
      }
      handleSubmit = e => {
        e.preventDefault()
      }

    render() {
        const {
            isError,
            isLoading,
            newsList,
            searchResults,
            searchQuery,
        } = this.state
        const queryResults = searchQuery === `` ? newsList : searchResults

        if (isLoading) { }
        if (isError) { }

        return (
            <div>
                <div style={{ margin: `0 auto` }}>
                    <form onSubmit={this.handleSubmit}>
                        <div style={{ margin: `0 auto` }}>
                            <label htmlFor="Search" style={{ paddingRight: `10px` }}>
                                Enter your search here
                            </label>
                            <input
                                id="Search"
                                value={searchQuery}
                                onChange={this.searchData}
                                placeholder="Enter your search here"
                                style={{ margin: `0 auto`, width: `400px` }}
                            />
                        </div>
                    </form>
                    <div>
                        Number of items:
                        {queryResults.length}
                        <table
                            style={{
                                width: `100%`,
                                borderCollapse: `collapse`,
                                borderRadius: `4px`,
                                border: `1px solid #d3d3d3`,
                            }}
                        >
                            <thead style={{ border: `1px solid #808080` }}>
                                <tr>
                                    <th
                                        style={{
                                            textAlign: `left`,
                                            padding: `5px`,
                                            fontSize: `14px`,
                                            fontWeight: 600,
                                            borderBottom: `2px solid #d3d3d3`,
                                            cursor: `pointer`,
                                        }}
                                    >
                                        Book ISBN
                                    </th>
                                    <th
                                        style={{
                                            textAlign: `left`,
                                            padding: `5px`,
                                            fontSize: `14px`,
                                            fontWeight: 600,
                                            borderBottom: `2px solid #d3d3d3`,
                                            cursor: `pointer`,
                                        }}
                                    >
                                        Book Title
                                    </th>
                                    <th
                                        style={{
                                            textAlign: `left`,
                                            padding: `5px`,
                                            fontSize: `14px`,
                                            fontWeight: 600,
                                            borderBottom: `2px solid #d3d3d3`,
                                            cursor: `pointer`,
                                        }}
                                    >
                                        Book Author
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* eslint-disable */}
                                {queryResults.map(item => {
                                    return (
                                        <tr key={`row_${item.isbn}`}>
                                            <td
                                                style={{
                                                    fontSize: `14px`,
                                                    border: `1px solid #d3d3d3`,
                                                }}
                                            >
                                                {item.isbn}
                                            </td>
                                            <td
                                                style={{
                                                    fontSize: `14px`,
                                                    border: `1px solid #d3d3d3`,
                                                }}
                                            >
                                                {item.title}
                                            </td>
                                            <td
                                                style={{
                                                    fontSize: `14px`,
                                                    border: `1px solid #d3d3d3`,
                                                }}
                                            >
                                                {item.author}
                                            </td>
                                        </tr>
                                    )
                                })}
                                {/* eslint-enable */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    // getOrCreateIndex = () =>
    //     this.index
    //         ? this.index
    //         : // Create an elastic lunr index and hydrate with graphql query results
    //         Index.load(this.props.searchIndex)

    // search = evt => {
    //     const query = evt.target.value
    //     this.index = this.getOrCreateIndex()
    //     this.setState({
    //         query,
    //         // Query the index with search string to get an [] of IDs
    //         results: this.index
    //             .search(query, {})
    //             // Map over each ID and return the full document
    //             .map(({ ref }) => this.index.documentStore.getDoc(ref)),
    //     })
    // }
}

export default Search