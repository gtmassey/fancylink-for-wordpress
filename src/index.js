/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
import {registerBlockType} from '@wordpress/blocks';
import {InspectorControls, RichText, useBlockProps} from '@wordpress/block-editor';
import {apiFetch} from '@wordpress/api-fetch';
import {PanelBody, SelectControl} from "@wordpress/components";
import {useEffect} from "@wordpress/element";
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor. All other files
 * get applied to the editor only.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';
import './editor.scss';
import metadata from './block.json';


const getPages = async () => {
    const data = await wp.apiFetch({path: '/wp/v2/pages'});
    return [
        {label: 'Select a Page', value: ''},
        ...data.map((post) => ({label: post.title.rendered, value: post.link})),
    ];
};

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType(metadata.name, {
    title: 'Interactive Links',
    icon: 'excerpt-view',
    category: 'design',
    attributes: {
        linkTitle: {
            type: 'string',
            source: 'html',
            selector: 'p.nav-link.h2',
        },
        linkSubtitle: {
            type: 'string',
            source: 'html',
            selector: 'p.subtitle',
        },
        url: {
            type: 'string',
            source: 'attribute',
            selector: 'a',
            attribute: 'href',
        },
    },
    edit: (props) => {
        const {

            className,
            attributes: {
                linkTitle,
                linkSubtitle,
                url
            },
            setAttributes,
        } = props;

        const onChangeTitle = (value) => {
            console.log(value);
            setAttributes({linkTitle: value});
        };

        const onChangeSubTitle = (value) => {
            console.log(value);
            setAttributes({linkSubtitle: value});
        };

        const onChangeUrl = (uri) => {
            console.log(uri);
            setAttributes({url: uri});
        }
        const [pages, setPages] = React.useState([]);

        useEffect(() => {
            getPages().then((pages) => {
                setPages(pages);
            });
        }, []);
        return (
            <div>
                <InspectorControls>
                    <PanelBody title="Page or Post URL">
                        <SelectControl
                            label="Select a page"
                            value={url}
                            options={pages}
                            onChange={onChangeUrl}
                        />
                    </PanelBody>
                </InspectorControls>
                <div className="content-wrap" {...useBlockProps()}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-lg-10">
                                <div className="pt-25 pb-25">
                                    <ul className="nav flex-column">
                                        <li className="nav-item">
                                            <RichText
                                                formats={['core/bold', 'core/italic', 'core/strikethrough']}
                                                tagName="p"
                                                className="nav-link h2"
                                                value={linkTitle}
                                                placeholder="Link Title"
                                                onChange={onChangeTitle}
                                            />
                                            <RichText
                                                formats={['core/bold', 'core/italic', 'core/strikethrough']}
                                                tagName="p"
                                                className="subtitle"
                                                value={linkSubtitle}
                                                placeholder="link subtitle"
                                                onChange={onChangeSubTitle}
                                            />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    save: (props) => {
        const {
            className,
            attributes: {
                linkTitle,
                linkSubtitle,
                url
            },
        } = props;
        return (
            <div className="content-wrap" {...useBlockProps.save()}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10">
                            <div className="pt-25 pb-25">
                                <ul className="nav flex-column interactive-links interactive-links-style-2">
                                    <li className="nav-item">
                                        <a href={url} style={{textDecoration: 'none'}}>
                                            <RichText.Content
                                                tagName="p"
                                                className="nav-link h2"
                                                value={linkTitle}
                                            />
                                            <RichText.Content
                                                tagName="p"
                                                className="subtitle"
                                                value={linkSubtitle}
                                            />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});


