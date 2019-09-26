import React from "react";
import { asyncComponent } from "react-async-component";

type PageLoaderProps = {
  page: string;
};

class PageLoader extends React.Component<PageLoaderProps, {}> {
  constructor(props: PageLoaderProps) {
    super(props);
  }

  render() {
    console.log(this.props.page);
    const AsyncComponent = asyncComponent({
      resolve: () => import(`./pages/${this.props.page}`)
    });
    return <AsyncComponent />;
  }
}

export default PageLoader;
