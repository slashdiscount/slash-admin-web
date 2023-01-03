import React from "react";

function SliderImageList(props: any): JSX.Element {
    return (
        <div className="table-responsive portlet">
            <table className="table table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">SEQUENCE NO</th>
                        <th scope="col">IMAGE</th>
                        <th scope="col">CITY</th>
                        <th scope="col">DATE</th>
                        <th scope="col">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {props.sliderImages}
                </tbody>
            </table>
        </div>

    );
}

export default SliderImageList;
